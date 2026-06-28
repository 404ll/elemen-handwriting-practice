export async function runSearchAgentPipeline({ query, rawFile, targetModel }) {
  const posts = rawFile
    ? loadRawPosts(rawFile)
    : await searchTwitterPosts({ query });

  const filteredPosts = dedupePosts(posts).filter(isUsefulPromptCandidate);
  saveJson("raw.json", filteredPosts);

  const analysisResults = await analyzePostsWithAI(filteredPosts, {
    targetModel,
    batchSize: 20,
    concurrency: 3,
  });

  const promptRecords = filteredPosts
    .map((post) => buildPromptRecord(post, analysisResults.get(post.id)))
    .filter(Boolean);

  saveJson("prompts.json", promptRecords);
  return promptRecords;
}
