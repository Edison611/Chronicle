import requests
import json

def get_important_moments(story):
    try:
        url = 'http://localhost:11434/api/chat'
        prompt = (
            "List the main moments in the story, keep it to 5-7: " + story + 
            ", with their page numbers in integer format, no descriptions required. Provide the response in JSON format only. " +
            "Use the following format: {'timeline': [ { 'moment': 'Moment 1', 'page': num, {...}, ...]}"
        )
        payload = {
            "model": "llama3.1",  # Ensure this model is available
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "stream": False  # Disable streaming for simplicity
        }
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise HTTP errors

        # Parse the response
        data = response.json()
        # print("Raw response:", data)  # Debugging: Print the raw response

        # Extract the content from the response
        answer = data.get("message", {}).get("content", "")
        # print("Answer:", answer)  # Debugging: Print the answer

        # Parse the JSON content from the answer
        start = answer.find('{')
        end = answer.rfind('}')
        if start != -1 and end != -1 and start < end:
            json_str = answer[start:end+1]
            try:
                characters_json = json.loads(json_str)
                return characters_json
            except json.JSONDecodeError as e:
                return f"JSON decode error: {e}"
        else:
            return "No valid JSON found in response."
    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error occurred: {http_err}"
    except KeyError as key_err:
        return f"Key error in response data: {key_err}"
    except Exception as e:
        return f"An error occurred: {e}"

# Example usage
print(get_important_moments("Hamlet"))