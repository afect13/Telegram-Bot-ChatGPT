build:
 docker build -t afectgpt .

run:
 docker run -d -p 3000:3000 --name afectgpt --rm afectgpt