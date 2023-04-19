
# Get started with llama.cpp

Use llama.cpp to run a gpt-like large language model queries 100% offline on relatively modest hardware.

This is nothing more than a convinient hello world to get started using llama.cpp

# Install

```
npm install
```

# Get Models

```
wget https://huggingface.co/eachadea/legacy-ggml-vicuna-7b-4bit/resolve/main/ggml-vicuna-7b-4bit-rev1.bin -O ./models/ggml-vicuna-7b-4bit-rev1.bin
wget https://huggingface.co/eachadea/ggml-gpt4-x-alpaca-13b-native-4bit/resolve/main/gpt4-x-alpaca-13b-native-ggml-q4_0.bin -O ./models/gpt4-x-alpaca-13b-native-ggml-q4_0.bin
```

If you use another model, make sure you change the reference in `index.mjs`


# Run

```
node index.mjs "why the sky is blue"

***

The sky appears blue due to the scattering of sunlight by the Earth's atmosphere. When sunlight enters the Earth's atmosphere, it encounters molecules of gases such as nitrogen and oxygen, which absorb and scatter light in all directions.

The blue light is scattered more than any other color because it has a shorter wavelength, and when it reaches our eyes, it appears as a blue sky. During sunrise and sunset, the sunlight has to travel through a greater distance of the Earth's atmosphere, which causes more of it to be scattered in all directions, making the sky appear more blue.

In addition, the scattering of light by the atmosphere also causes the sun to appear larger and more orange during sunrise and sunset, due to the longer wavelengths of red and orange light being scattered less than blue and green light.

```

# Links

- https://github.com/ggerganov/llama.cpp
- https://github.com/Atome-FE/llama-node
- https://huggingface.co/eachadea // good models