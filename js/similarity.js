function areSentencesAlmostSame(sentence1, sentence2) {
    // Convert sentences to lowercase to make the comparison case-insensitive
    const s1 = sentence1.toLowerCase();
    const s2 = sentence2.toLowerCase();

    // Use string-similarity library for similarity comparison
    const similarity = stringSimilarity.compareTwoStrings(s1, s2);

    // Define a threshold for similarity
    const similarityThreshold = 0.5; // Adjust as needed

    // Check if the similarity is above the threshold
    return similarity >= similarityThreshold;
}