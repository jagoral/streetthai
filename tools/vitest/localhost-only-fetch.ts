import { Agent, setGlobalDispatcher, type Dispatcher } from "undici";

const localHostnames = new Set(["localhost", "127.0.0.1", "[::1]"]);

setGlobalDispatcher(new Agent().compose(rejectNonLocalOrigins));

function rejectNonLocalOrigins(dispatch: Dispatcher.Dispatch): Dispatcher.Dispatch {
  return (options, handler) => {
    const origin = new URL(String(options.origin));
    if (!localHostnames.has(origin.hostname)) {
      throw new Error(`Blocked request to non-localhost origin ${origin.origin}`);
    }
    return dispatch(options, handler);
  };
}
