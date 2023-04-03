import os
import pty
import select
import streamlit as st

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

pid, fd = run_terminal_process('/bin/bash')

st.title("Terminal Emulator")

if 'output' not in st.session_state:
    st.session_state.output = ""

input_str = st.text_input("Enter a command:")

if st.button("Send command"):
    try:
        send_to_terminal(fd, input_str + '\n')
        output = read_from_terminal(fd)
        st.session_state.output += output
    except Exception as e:
        st.error(f"Error: {e}")

st.write("Output:")
st.write(st.session_state.output)

# Clean up the child process when the app is closed
def clean_up():
    os.close(fd)
    os.waitpid(pid, 0)
