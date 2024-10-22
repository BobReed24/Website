#!/bin/bash
# Navigate to the project directory
sudo apt install tmux

cd /workspace/spring-petclinic || { echo "Directory 'site' not found. Exiting."; exit 1; }

tmux new-session -d -s win96 'cd website/templates/win96 && php -S 0.0.0.0:3001'

tmux new-session -d -s ports 'bash ports.sh'

tmux new-session -d -s app 'cd /workspace/spring-petclinic/website && python3 app.py'
