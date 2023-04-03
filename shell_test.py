#!/usr/bin/env python3

import os
import pty
import select
import subprocess

def run_terminal_process(shell):
    pid, fd = pty.fork()
    if pid == 0:  # Child process
        os.execv(shell, [shell])
    else:  # Parent process
        return pid, fd

def read_from_terminal(fd):
    output = b""
    while True:
        r, _, _ = select.select([fd], [], [], 0.1)
        if r:
            try:
                buf = os.read(fd, 1024)
                if not buf:
                    break
                output += buf
            except OSError:
                break
        else:
            break
    return output.decode("utf-8", errors="ignore")

def send_to_terminal(fd, input_str):
    os.write(fd, input_str.encode())

# Run the terminal process (use the appropriate shell for your system, e.g., '/bin/bash' or '/bin/sh')
pid, fd = run_terminal_process('/bin/bash')

# Send a command to the terminal
# send_to_terminal(fd, 'echo "Hello, World!"\n')

while True:
    terminal_input = input("Enter a command: ")
    send_to_terminal(fd, terminal_input + '\n')

    # Read the output from the terminal
    output = read_from_terminal(fd)
    print(output)

# Don't forget to close the file descriptor and clean up the child process when done
os.close(fd)
os.waitpid(pid, 0)
