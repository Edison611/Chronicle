import json
import requests

cumulative_characters = []
base_url = 'http://localhost:11434/api/generate'
model_name = 'llama3.1'

# Load chunks data
with open('chunks.json', 'r') as infile:
    chunks = json.load(infile)

# Collect all prompts
prompts = []
for chunk in chunks:
    text = chunk['text']
    prompt = (
        f"Extract the characters mentioned in the text and reply with a JSON list "
        f"of their names, like ['Character1', 'Character2']. Text: {text}"
    )
    prompts.append(prompt)

# Send a single batch request (assuming the API supports batch processing)
try:
    response = requests.post(base_url, json={
        'model': model_name,
        'prompt': prompts,
        'stream': False
    })
    response.raise_for_status()
    responses = response.json()['responses']  # Adjust based on API response structure

    # Process each response
    for idx, generated_text in enumerate(responses):
        start = generated_text.find('[')
        end = generated_text.rfind(']')
        if start != -1 and end != -1 and end > start:
            json_str = generated_text[start:end+1]
            try:
                characters = json.loads(json_str)
                if isinstance(characters, list):
                    cumulative_characters.extend(characters)
                    print(f"Processed chunk {idx + 1}/{len(chunks)}")
                else:
                    print(f"Invalid response format for chunk {idx + 1}")
            except json.JSONDecodeError as json_err:
                print(f"JSON decode error for chunk {idx + 1}: {json_err}")
        else:
            print(f"No JSON list found in response for chunk {idx + 1}")

except requests.exceptions.HTTPError as http_err:
    print(f"HTTP error occurred: {http_err}")
except Exception as err:
    print(f"An error occurred: {err}")

# Remove duplicates
cumulative_characters = list(set(cumulative_characters))

# Save the cumulative characters to a JSON file
with open('characters.json', 'w') as outfile:
    json.dump(cumulative_characters, outfile, indent=4)