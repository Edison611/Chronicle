import requests

API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2"
headers = {"Authorization": f"Bearer "}

def generate_image(prompt):
    response = requests.post(API_URL, headers=headers, json={"inputs": prompt})
    if response.status_code == 200:
        with open("generated_image.png", "wb") as f:
            f.write(response.content)
        print("Image saved as generated_image.png")
    else:
        print("Error:", response.text)





## Prompts

prompt = (
        f"Extract the characters mentioned in the text with what they say and reply with a valid JSON list "
        f"of their names, like [\"Character1\", \"Character2\"]. Ensure that the response "
        f"is valid JSON and does not include any comments or explanations. Text: {text}"
    )

