// Shared between the home quiz flow and /results so a finished quiz maps
// to a real, shareable URL (e.g. /results?room=Living+Room&material=Marble
// +%26+Stone&aesthetic=Organic+Modern&budget=%241%2C000%2B&priority=A+
// statement+table) instead of only living in React state.

export const RESULT_KEYS = ["room", "aesthetic", "material", "budget", "priority"] as const;

export function answersToQuery(answers: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const key of RESULT_KEYS) {
    if (answers[key]) params.set(key, answers[key]);
  }
  return params.toString();
}

export function queryToAnswers(params: URLSearchParams): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const key of RESULT_KEYS) {
    const value = params.get(key);
    if (value) answers[key] = value;
  }
  return answers;
}
