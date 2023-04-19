
# Install

```
pip install llama-index
```

# Configure

Get your api key from `https://platform.openai.com/account/api-keys`

```
export OPENAI_API_KEY=...
```

# Run

If index.json exists, it will load it, if it is not, it will regenerate it

```
./run.sh "your question"
```

# Data

The repository contains some data for testing:

- data_opts/paul_graham_essay.txt - http://www.paulgraham.com/worked.html
- data_opts/transcription_the_assyrians_empire_of_irons.txt - transcription of https://www.youtube.com/watch?v=jpAphcaVJIs
- data_opts/transcription_mcLaren_artura_review.txt - transcription of https://www.youtube.com/watch?v=ewg7o3jWKpU

symply copy dataset you want to use to ./data, remove `index.json` and `./run.sh query` to reindex


# Links

- https://gpt-index.readthedocs.io/en/latest/getting_started/installation.html
- https://gpt-index.readthedocs.io/en/latest/getting_started/starter_example.html

