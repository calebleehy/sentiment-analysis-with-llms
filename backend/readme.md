0. ensure pipenv is installed: https://pipenv.pypa.io/en/stable/index.html
> pip install --user pipenv

1. install requirements, NEEDS PYTHON 11
> cd .\backend && pipenv install [--python <path to python11's python.exe>]

2. download model
> pipenv run huggingface-cli download TheBloke/Mistral-7B-Instruct-v0.2-GGUF mistral-7b-instruct-v0.2.Q5_K_M.gguf --local-dir .\model --local-dir-use-symlinks False


Scrapped features: 
- jupyterlab: causes cross-platform dependency conflicts that we ran out of time to resolve. in particular the pywin32 and pywinpty sub-dependencies. If you do manage to get it working, here is what you can do:

	OPTIONAL if you want a more sandbox environment to play around: 
	- install, start jupyterlab
	> pipenv run python -m jupyterlab
	- start local inference server
	> pipenv run python -m llama_cpp.server --model .\model\mistral-7b-instruct-v0.2.Q5_K_M.gguf

