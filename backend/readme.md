0. ensure pipenv is installed: https://pipenv.pypa.io/en/stable/index.html
> pip install --user pipenv

1. install requirements
> cd .\backend && pipenv install

2. download model
> pipenv run huggingface-cli download TheBloke/Mistral-7B-Instruct-v0.2-GGUF mistral-7b-instruct-v0.2.Q5_K_M.gguf --local-dir .\model --local-dir-use-symlinks False

OPTIONAL if you want a more sandbox environment to play around: 
- start jupyterlab
> pipenv run python -m jupyterlab
- start local inference server
> pipenv run python -m llama_cpp.server --model .\model\mistral-7b-instruct-v0.2.Q5_K_M.gguf

