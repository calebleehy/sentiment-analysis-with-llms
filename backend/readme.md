0. ensure pipenv is installed: https://pipenv.pypa.io/en/stable/index.html
> pip install --user pipenv
1. install requirements
> pipenv install
2. download model
5. download model
> cd ..
> mkdir model
> huggingface-cli download TheBloke/Mistral-7B-Instruct-v0.2-GGUF mistral-7b-instruct-v0.2.Q5_K_M.gguf --local-dir .\model --local-dir-use-symlinks False
6. cd to parent directory, start jupyterlab
> cd ..
> python -m jupyterlab
7. start local inference server
> python -m llama_cpp.server --model .\model\mistral-7b-instruct-v0.2.Q5_K_M.gguf

