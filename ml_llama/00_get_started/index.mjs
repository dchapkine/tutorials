import { LLama } from "llama-node";
import { LLamaCpp } from "llama-node/dist/llm/llama-cpp.js";
import path from "path";
import fs from "fs";

/*
    Model options:
    ./models/ggml-vicuna-7b-4bit-rev1.bin
    ./models/gpt4-x-alpaca-13b-native-ggml-q4_0.bin
*/
const model = path.resolve("./models/ggml-vicuna-7b-4bit-rev1.bin");
const args = process.argv;

if (!fs.existsSync(model)) {
  console.log(`error: make sure your model exists, nothing found here: \n${model}\n for download instructins check the readme`)
  process.exit(1)
}

if (!args[2]) {
  console.log("usage: node test.mjs \"why the sky is blue\"")
  process.exit(1)
}
const question = args[2];

const llama = new LLama(LLamaCpp);
const config = {
    path: model,
    enableLogging: false,
    nCtx: 1024,
    nParts: -1,
    seed: 0,
    f16Kv: false,
    logitsAll: false,
    vocabOnly: false,
    useMlock: false,
    embedding: false,
    useMmap: true,
};

llama.load(config);

const prompt = `### Human answer the question below:

-------------
${question}
-------------

### Assistant:`;

llama.createCompletion(
    {
        nThreads: 4,
        nTokPredict: 2048,
        topK: 40,
        topP: 0.1,
        temp: 0.2,
        repeatPenalty: 1,
        stopSequence: "### Human",
        prompt,
    },
    (response) => {
        process.stdout.write(response.token);
    }
);