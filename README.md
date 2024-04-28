# sentiment-analysis-with-llms
This project gauges customer sentiments towards the bank’s services using advanced natural language processing techniques.

## Introduction
We are a group of students from National University of Singapore taking DSA3101 doing a customer feedback sentiment analysis project for our Bank client. Using advanced Natural Language Processing (NLP) techniques such as Large Language Models (LLMs), we analyzed customer reviews from Google Play Store and Apple Store to help the client understand and improve customer satisfaction.

## Key features
* Customizable Filters: Filter data by sentiment, service, and issue to focus on specific insights.
* Competitor Analysis: Compare sentiment trends with competitors to benchmark performance.
* Actionable Insights: Receive recommendations for improving customer experience based on sentiment analysis.

## Architecture

### Backend Process Flow
![Backend Process Flow](https://github.com/calebleehy/sentiment-analysis-with-llms/assets/76025287/fcd6f400-ab5f-4e09-8fee-63454c37e42c)

### Backend Structure
![Backend Structure](https://github.com/calebleehy/sentiment-analysis-with-llms/assets/76025287/1a09d251-94f6-41ed-95ab-528ea855a642)

### Frontend Struture
![Frontend Structure](https://github.com/calebleehy/sentiment-analysis-with-llms/assets/76025287/d8bfe7ba-1bf5-413e-8240-a010b7943120)


## Installation 

### Data Mining Pipeline
#### Setup instructions
##### Step 0: Ensure pipenv is installed: https://pipenv.pypa.io/en/stable/index.html
    pip install --user pipenv
    
##### Step 1: edit .env to set up environment variables for LLM GPU offloading
> see [page 6a](https://github.com/calebleehy/sentiment-analysis-with-llms/wiki/6a.-GPU-Offloading-for-llama%E2%80%90cpp%E2%80%90python)

##### Step 2: Install requirements, NEEDS PYTHON 11
    cd .\backend && pipenv install [--python <path to python11's python.exe>]

##### Step 3: Download model
    pipenv run huggingface-cli download TheBloke/Mistral-7B-Instruct-v0.2-GGUF mistral-7b-instruct-v0.2.Q5_K_M.gguf --local-dir .\model --local-dir-use-symlinks False
#### Further steps on actually running the pipeline are located within [backend's readme](backend/readme.md)
### Web Application Installation Instructions
The web application can be installed either manually or with docker containers
### 1. Install manually
##### Step 1: Install dependencies in requirement.txt
    pip install -r requirement.txt
##### Step 2: cd to backend/server directory
    cd backend/server
##### Step 3: start flask server
    python main.py
##### Step 4: cd to frontend/ directory
    cd frontend/
##### Step 5: Install frontend dependencies
    npm install
##### Step 6: Start to react server
    npm start
##### Step7: Access the web application at:
    http://localhost:3000
OPTIONAL if using other web servers (Nginx)
##### Build the frontend by:
    npm build
### 2. Install with container
##### Start [docker desktop](https://www.docker.com/products/docker-desktop/) and run:
    docker-compose up --build
##### Access the web application at
    http://localhost

## Documentation
* Wiki Page: [https://docs.google.com/document/d/1cYT9Ljt-SsauDqnpxowzce_r4Xhp_ljDl60fP2XdjmM/edit](https://github.com/calebleehy/gxs-sentiment-analysis/wiki/1.-Introduction)
* Technical Handover: https://docs.google.com/document/d/1wqhj5kz9XdS5hioQPgAznluJ-uNrKReKkUuNyCnAoPM/edit

## Contributors 
- *Caleb Lee Heng Yi* (Frontend)
- *Cheryl Tan Geok Ching* (Frontend)
- *Lim Jing Rui* (Backend)
- *Ng Elangel* (Frontend)
- *Ng Keen Yung* (Backend)
- *Sarah Goh Yue En* (Backend)
- *Shi Shuangqi* (Backend)
- *Wang Jianing* (Frontend)

## Supervisor
- Prof *Hernandez Marin Sergio*

## Industrial partner
- GXS Bank Singapore (https://www.gxs.com.sg/)
