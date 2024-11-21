import os

def replace_in_html_files(directory, old_string, new_string):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                content = content.replace(old_string, new_string)

                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)

if __name__ == "__main__":
    templates_dir = "Website"
    old_keyword = "c0tw75743tw"
    new_keyword = "q4xzkcjvsoc"
    replace_in_html_files(templates_dir, old_keyword, new_keyword)
