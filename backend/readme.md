1. cd to venv folder within backend
> cd venv
2. create venv for project
> python -m venv mistral_prototype
3. activate virtual environment
> .\mistral_prototype\Scripts\activate
4. install required libraries within venv
> pip install -r ..\requirements.txt
5. download model
> cd ..
> mkdir model
> huggingface-cli download TheBloke/Mistral-7B-Instruct-v0.2-GGUF mistral-7b-instruct-v0.2.Q5_K_M.gguf --local-dir .\model --local-dir-use-symlinks False
6. cd to parent directory, start jupyterlab
> cd ..
> python -m jupyterlab
7. start local inference server
> python -m llama_cpp.server --model .\model\mistral-7b-instruct-v0.2.Q5_K_M.gguf

