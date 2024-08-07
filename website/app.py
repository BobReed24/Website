from flask import Flask, render_template, request, redirect, url_for, session, make_response, send_from_directory, flash
from flask_wtf import FlaskForm
from wtforms import HiddenField
from werkzeug.utils import secure_filename
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os
import json
import logging

app = Flask(__name__)
app.secret_key = 'G7H2J5K8L9M1N3P4Q6R7S8T9V2X4Y5Z1'  # Change this to a strong secret key
app.config['UPLOAD_FOLDER'] = 'static/uploads'
socketio = SocketIO(app)
REQUESTS_FILE_PATH = 'application/data/requests.txt'
MESSAGES_FILE_PATH = 'application/data/messages.txt'
MODE_FILE_PATH = 'application/data/mode.txt'
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins, adjust as needed
CORS(app, supports_credentials=True)  # Allows credentials like cookies

# List of words for the Hangman game
words = ["python", "flask", "javascript", "hangman", "web"]

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Path to the root directory and lock file
ROOT_DIR = os.path.dirname(__file__)
LOCK_FILE = os.path.join(ROOT_DIR, 'lock.txt')

admin_password = 'type here to search'  # Default password


def is_locked():
    return os.path.exists(LOCK_FILE)


def set_admin_password(password):
    global admin_password
    admin_password = password


def update_admin_password():
    new_password = 'dev'  # Set your new admin password here
    set_admin_password(new_password)


class CSRFForm(FlaskForm):
    csrf_token = HiddenField()


# Define functions to handle background filename storage
def get_user_background(username):
    # Retrieve from session
    return session.get(f'{username}_background_filename',
                       'default_background.png')


def set_user_background(username, filename):
    session[f'{username}_background_filename'] = filename


# Define the path to requests.txt
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REQUESTS_FILE_PATH = os.path.join(BASE_DIR, 'config', 'requests.txt')


def get_mode():
    # Get the saved mode (light or dark)
    try:
        with open(MODE_FILE_PATH, 'r') as file:
            mode = file.read().strip()
            return mode if mode in ['light', 'dark'] else 'light'
    except IOError:
        return 'light'


def set_mode(mode):
    # Save the mode
    try:
        with open(MODE_FILE_PATH, 'w') as file:
            file.write(mode)
    except IOError as e:
        print(f"Error writing to file: {e}")


@app.route('/')
def index():
    if 'username' in request.cookies:
        return redirect(url_for('home'))
    if is_locked() and 'username' not in session:
        return redirect(url_for('login_user'))
    return redirect(url_for('signup_page'))


@app.route('/signup', methods=['GET', 'POST'])
def signup_page():
    if is_locked() and 'username' not in session:
        return "The site is currently locked. Please contact the admin."

    if request.method == 'POST':
        if is_locked() and 'username' not in session:
            return "The site is currently locked. Please contact the admin."

        username = request.form['username']
        password = request.form['password']
        email = request.form['email']  # Added email field

        user_file = os.path.join(ROOT_DIR, 'accounts', f'{username}.txt')

        if os.path.exists(user_file):
            return "Username already exists!"
        else:
            with open(user_file, 'w') as f:
                f.write(
                    f'Username: {username}\nPassword: {password}\nEmail: {email}\nPremium: False'
                )
            return redirect(
                url_for('login_user'))  # Redirect to login after signup
    return render_template('signup.html')


@app.route('/login', methods=['GET', 'POST'])
def login_user():
    # Check if the site is locked
    locked = is_locked()

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        security_code = request.form.get('security_code', '')

        # Check if it's an admin login
        if username == 'admin':
            if password == admin_password:
                if locked and security_code != '4512':
                    flash("Invalid security code!"
                          )  # Admin needs to provide security code when locked
                else:
                    session['username'] = username
                    return redirect(url_for('admin_panel'))
            else:
                flash("Username or password is incorrect!")

        # Check if it's a regular user login
        else:
            user_file = os.path.join(ROOT_DIR, 'accounts', f'{username}.txt')

            if os.path.exists(user_file):
                with open(user_file, 'r') as f:
                    lines = f.readlines()
                    saved_password = ''
                    premium_status = ''
                    for line in lines:
                        if line.startswith('Password:'):
                            saved_password = line.split(
                                'Password: ')[1].strip()
                        elif line.startswith('Premium:'):
                            premium_status = line.split('Premium: ')[1].strip()

                if saved_password == password:
                    if premium_status == 'True' or not locked:
                        session['username'] = username
                        return redirect(url_for('home'))
                    else:
                        if security_code == '4512':
                            session['username'] = username
                            return redirect(url_for('home'))
                        else:
                            flash("Invalid security code!")
                else:
                    flash("")
            else:
                flash("Username or password is incorrect!")

    # Render the login page with locked status
    return render_template('login.html', locked=locked)


@app.route('/logout')
def logout():
    session.pop('username', None)
    resp = make_response(redirect(
        url_for('login_user')))  # Redirect to login page
    resp.delete_cookie('username')  # Clear the cookie
    return resp


@app.route('/admin', methods=['GET'])
def admin_panel():
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login_user'))

    user_files = [
        f for f in os.listdir(os.path.join(ROOT_DIR, 'accounts'))
        if f.endswith('.txt')
    ]
    users = [f.replace('.txt', '') for f in user_files]

    return render_template('admin.html', users=users)


@app.route('/home', methods=['GET', 'POST'])
def home():
    if 'username' not in session:
        return redirect(url_for('login_user'))

    username = session.get('username')
    background_filename = get_user_background(username)

    if request.method == 'POST':
        if 'background' in request.files:
            file = request.files['background']
            if file.filename != '':
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                set_user_background(username, filename)
                flash('')
                return redirect(url_for('home'))
        elif 'chat_message' in request.form:
            message = request.form['chat_message']
            save_chat_message(username, message)
            return redirect(url_for('home'))

    return render_template('home.html',
                           username=username,
                           background_filename=background_filename)


@app.route('/admin/view_users')
def view_users():
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login_user'))

    user_files = [
        f for f in os.listdir(os.path.join(ROOT_DIR, 'accounts'))
        if f.endswith('.txt')
    ]
    users = []

    for file in user_files:
        username = file.replace('.txt', '')
        with open(os.path.join(ROOT_DIR, 'accounts', file), 'r') as f:
            lines = f.readlines()
            password = 'Not found'
            premium_status = 'False'  # Default value
            email = 'Not found'  # Default value
            for line in lines:
                if line.startswith('Password:'):
                    password = line.split('Password: ')[1].strip()
                elif line.startswith('Premium:'):
                    premium_status = line.split('Premium: ')[1].strip()
                elif line.startswith('Email:'):
                    email = line.split('Email: ')[1].strip()
            users.append({
                'username': username,
                'password': password,
                'premium_status': premium_status,
                'email': email  # Add email to the user dictionary
            })

    # Create a form instance
    form = CSRFForm()

    return render_template('view_user.html', users=users, form=form)


@app.route('/admin/delete_user/<username>', methods=['POST'])
def delete_user(username):
    try:
        if 'username' not in session or session['username'] != 'admin':
            return redirect(url_for('login_user'))

        user_file = os.path.join(ROOT_DIR, 'accounts', f'{username}.txt')

        if os.path.exists(user_file):
            os.remove(user_file)
            return redirect(url_for('view_users'))
        else:
            return "User not found!"
    except Exception as e:
        app.logger.error(f"Error deleting user: {e}")
        return "An error occurred while deleting the user."


@app.route('/admin/lock', methods=['POST'])
def lock_site():
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login_user'))

    with open(LOCK_FILE, 'w') as f:
        f.write('locked')
    return redirect(url_for('admin_panel'))


@app.route('/admin/unlock', methods=['POST'])
def unlock_site():
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login_user'))

    if os.path.exists(LOCK_FILE):
        os.remove(LOCK_FILE)
    return redirect(url_for('admin_panel'))


@app.route('/admin/editor', methods=['GET', 'POST'])
def code_editor():
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login_user'))

    if request.method == 'POST':
        if 'upload' in request.files:
            file = request.files['upload']
            if file.filename:
                file_path = os.path.join(ROOT_DIR, file.filename)
                file.save(file_path)
        if 'code' in request.form and 'file' in request.form:
            file_path = os.path.join(ROOT_DIR, request.form['file'])
            # Prevent editing app.py
            if os.path.basename(file_path) == 'app.py':
                return redirect(url_for('code_editor'))
            with open(file_path, 'w') as f:
                f.write(request.form['code'])
        if 'new_directory' in request.form:
            directory_path = os.path.join(ROOT_DIR,
                                          request.form['new_directory'])
            if not os.path.exists(directory_path):
                os.makedirs(directory_path)
        if 'filename' in request.form and request.form.get(
                'action') == 'delete':
            filename = request.form['filename']
            if filename != 'app.py':
                file_path = os.path.join(ROOT_DIR, filename)
                if os.path.isfile(file_path):
                    os.remove(file_path)
        return redirect(url_for('code_editor'))

    # List all files and directories
    files = []
    for root, dirs, filenames in os.walk(ROOT_DIR):
        for name in filenames:
            file_path = os.path.relpath(os.path.join(root, name), ROOT_DIR)
            files.append(file_path)
        for name in dirs:
            dir_path = os.path.relpath(os.path.join(root, name), ROOT_DIR)
            files.append(dir_path)

    selected_file_content = ""
    selected_file_name = request.args.get('file')
    if selected_file_name:
        selected_file_path = os.path.join(ROOT_DIR, selected_file_name)
        if os.path.isfile(selected_file_path):
            # Prevent displaying content for app.py
            if os.path.basename(selected_file_path) != 'app.py':
                with open(selected_file_path, 'r') as f:
                    selected_file_content = f.read()

    return render_template('editor.html',
                           files=files,
                           selected_file_content=selected_file_content,
                           selected_file_name=selected_file_name)


@app.route('/admin/editor/<path:filename>', methods=['GET', 'POST'])
def edit_file(filename):
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login_user'))

    file_path = os.path.join(ROOT_DIR, filename)
    if request.method == 'POST':
        code = request.form['code']
        with open(file_path, 'w') as f:
            f.write(code)
        return redirect(url_for('code_editor'))

    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            code = f.read()
        return render_template('edit_file.html', filename=filename, code=code)
    else:
        return "File not found!"


@app.route('/download/<path:filename>', methods=['GET'])
def download_file(filename):
    if 'username' not in session or session['username'] != 'admin':
        return redirect(url_for('login_user'))

    file_path = os.path.join(ROOT_DIR, filename)
    if os.path.exists(file_path):
        return send_from_directory(directory=ROOT_DIR,
                                   path=filename,
                                   as_attachment=True)
    else:
        return "File not found!"


@app.route('/admin/update_premium_status/<username>', methods=['POST'])
def update_premium_status(username):
    try:
        if 'username' not in session or session['username'] != 'admin':
            return redirect(url_for('login_user'))

        user_file = os.path.join(ROOT_DIR, 'accounts', f'{username}.txt')

        if os.path.exists(user_file):
            with open(user_file, 'r') as f:
                lines = f.readlines()

            new_premium_status = 'True' if 'premium' in request.form else 'False'

            with open(user_file, 'w') as f:
                for line in lines:
                    if line.startswith('Premium:'):
                        f.write(f'Premium: {new_premium_status}\n')
                    else:
                        f.write(line)

            return redirect(url_for('view_users'))
        else:
            return "User not found!"
    except Exception as e:
        app.logger.error(f"Error updating premium status: {e}")
        return "An error occurred while updating the premium status."


@app.route('/game/index.html')
def game_page():
    try:
        # Check if the user is logged in by verifying the session
        if 'username' not in session:
            return redirect(
                url_for('index'))  # Redirect to index.html if not logged in

        return render_template('game/index.html')
    except Exception as e:
        return str(e), 500  # Return error message and status code


@app.route('/apply_background', methods=['POST'])
def apply_background():
    if 'username' not in session:
        return redirect(url_for('login_user'))

    username = session.get('username')
    background_filename = get_user_background(username)

    # Assuming you are setting the background filename to be used by the template
    # You might need to adjust how you store the filename or apply it based on your logic

    # Redirect back to the home page without showing a flash message
    return redirect(url_for('home'))


@app.route('/request', methods=['GET', 'POST'])
def request_password_reset():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        # Write the request to requests.txt
        try:
            with open('application/data/requests.txt', 'a') as file:
                file.write(
                    f"Password reset requested for username: {username}, email: {email}\n"
                )
        except IOError as e:
            # Handle file writing errors here
            print(f"Error writing to file: {e}")
        return redirect(url_for('password_reset_confirmation'))
    return render_template('request.html')


@app.route('/password-reset-confirmation')
def password_reset_confirmation():
    return '''
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Confirmation</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
        </head>
        <body>
            <main class="container">
                <h1>Password Reset Request Submitted</h1>
                <p>Your password reset request has been submitted. An admin will review it. Make sure to keep checking your email for emails from alex@ayxia.com or 2021416@student.goddardusd.com</p>

                <!-- Back to Login Button -->
                <a href="/login"><button type="button" role="button">Return to login</button></a>
            </main>
        </body>
        </html>
    '''


@app.route('/admin/delete_file', methods=['POST'])
def delete_file():
    filename = request.form.get('filename')
    if filename == 'app.py':
        abort(403)  # Forbidden

    file_path = os.path.join(ROOT_DIR, filename)
    if os.path.isfile(file_path):
        os.remove(file_path)
        return redirect(url_for('code_editor'))
    else:
        abort(404)  # File not found


@app.route('/admin/serve_file/<path:filename>')
def serve_file(filename):
    if filename == 'app.py':
        abort(403)  # Forbidden

    file_path = os.path.join(ROOT_DIR, filename)
    if os.path.isfile(file_path):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            return send_file(file_path, mimetype='image/jpeg')
        return send_file(file_path)
    else:
        abort(404)  # File not found


@app.route('/hangman')
def hangman():
    return render_template('hangman.html')


@app.route('/hangman/get_word')
def get_word():
    word = random.choice(words)
    return jsonify({'word': word})


@app.route('/hangman/check_guess', methods=['POST'])
def check_guess():
    data = request.json
    word = data['word']
    guesses = data['guesses']
    result = ''.join([letter if letter in guesses else '_' for letter in word])
    return jsonify({'result': result, 'correct': set(word) == set(guesses)})


@app.route('/chat_room', methods=['GET', 'POST'])
def chat_room():
    if 'username' not in session:
        return redirect(url_for('login_user'))

    username = session.get('username')
    mode = get_mode()

    if request.method == 'POST':
        if request.json:
            if 'text' in request.json:
                message_text = request.json['text']
                if message_text:
                    try:
                        with open(MESSAGES_FILE_PATH, 'a') as file:
                            file.write(f"{username}: {message_text}\n")
                        return jsonify({'success': True})
                    except IOError as e:
                        print(f"Error writing to file: {e}")
            if 'mode' in request.json:
                mode = request.json['mode']
                set_mode(mode)
                return jsonify({'success': True})

    # Read chat messages
    try:
        with open(MESSAGES_FILE_PATH, 'r') as file:
            messages = [{
                'username': line.split(':')[0],
                'text': ':'.join(line.split(':')[1:]).strip()
            } for line in file]
    except IOError as e:
        print(f"Error reading from file: {e}")
        messages = []

    return render_template('chat_room.html', messages=messages, mode=mode)


@app.route('/send-message', methods=['POST'])
def send_message():
    if 'username' not in session:
        return redirect(url_for('login_user'))

    data = request.get_json()
    message_text = data.get('text')
    username = session.get('username')

    if message_text:
        try:
            with open(MESSAGES_FILE_PATH, 'a') as file:
                file.write(f"{username}: {message_text}\n")
            return jsonify({'success': True})
        except IOError as e:
            print(f"Error writing to file: {e}")

    return jsonify({'success': False})


@app.route('/save_message', methods=['POST'])
def save_message():
    data = request.get_json()
    message = data.get('message')
    if message:
        try:
            with open('/application/data/messages.txt', 'a') as file:
                file.write(f"{message}\n")
            return '', 204  # No content
        except IOError as e:
            print(f"Error writing to file: {e}")
            return '', 500  # Internal server error
    return '', 400  # Bad request


@app.route('/set_theme', methods=['POST'])
def set_theme():
    theme = request.form.get('theme')
    if theme in ['light', 'dark']:
        # Save the theme preference to the session or database
        session['theme'] = theme
        return '', 204  # No content
    return '', 400  # Bad request

@app.route('/windows96page')
def windows96page():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('windows96page.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
