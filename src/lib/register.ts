/**
 * A two-function pub/sub for one cross-tree action: "open this project".
 *
 * The command palette sits at the root of the app and the work register sits
 * several levels below it, and the only thing they need to agree on is a
 * string. A context provider for that would mean a provider, a hook, a
 * consumer and a re-render of everything between them; a module-level Set
 * means neither component has to know the other exists, and nothing above the
 * register re-renders when a row opens.
 */
type Handler = (id: string) => void;

const handlers = new Set<Handler>();

/** Subscribe. Returns the unsubscribe, so it drops straight into an effect. */
export function onOpenProject(handler: Handler): () => void {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}

export function openProject(id: string): void {
  for (const handler of handlers) handler(id);
}
