import sys, os, csv, json
import pandas as pd
from pathlib import Path
from llama_cpp import Llama

## GLOBAL VARS
BACKEND_ROOT = Path(os.path.dirname(os.path.abspath(__file__))).parent.absolute()
##

def create_csv(filename, headers):
    with open(filename, 'w', newline='', encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
def insert_row(filename, new_row):
    with open(filename, 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(new_row)
def get_here():
    """
    returns the script's current file location
    """
    return os.path.dirname(os.path.abspath(__file__))

def get_modelpath(folder = False):
    """
    returns path to mistral-7b-instruct-v0.2.Q5_K_M model file by default. 
    args: 
    - folder is False by default, set to True to get the absolute path to the model *folder* 
        - useful if you want to experiment with alternative model files
    """
    root = BACKEND_ROOT
    if not folder:
        modelfile = os.path.normpath(os.path.join(root, '.\\model\\mistral-7b-instruct-v0.2.Q5_K_M.gguf'))
        print(f"getting model file {modelfile}")
        return modelfile
    modelfolder = os.path.normpath(os.path.join(root, '.\\model\\mistral-7b-instruct-v0.2.Q5_K_M.gguf'))
    print(f"getting model folder {modelfolder}")
    return modelfolder

def get_datapath():
    root = BACKEND_ROOT
    datapath = os.path.normpath(os.path.join(root, '.\\data'))
    print(f"getting datapath {datapath}")
    return datapath
def load_model(modelpath,ctx=2048, chatformat="chatml", **kwargs):
    """
    returns a loaded model object
    args: 
    - modelpath, 
    - ctx = context window, default 2048
    - chat_format = chatml by default to facilitate JSON generation
    - additional arguments as specified in llama_cpp_python API can be passed in
    """
    if kwargs:
        llm = Llama(
            model_path=modelpath,
            n_gpu_layers=-1, # Uncomment to use GPU acceleration
            # seed=1337, # Uncomment to set a specific seed
            n_ctx=ctx, # Uncomment to increase the context window
            chat_format=chatformat,
            **kwargs
        )
    else:
        llm = Llama(
            model_path=modelpath,
            n_gpu_layers=-1, # Uncomment to use GPU acceleration
            # seed=1337, # Uncomment to set a specific seed
            n_ctx=ctx, # Uncomment to increase the context window
            chat_format=chatformat
        )
    return llm

## TESTING, run this script as standalone to see

def main():
    print(f"all paths relative to {BACKEND_ROOT}")
    print(get_modelpath())
    print(get_modelpath(folder = True))
    # llm = load_model(get_modelpath())
    llm_larger = load_model(get_modelpath(),50)
    print(get_datapath())

if __name__ == "__main__":
    main()
