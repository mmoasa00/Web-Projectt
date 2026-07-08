import { beforeEach, describe, expect, it } from "vitest";

import { currentSongId, usePlayer } from "./player-store";

/** Reset the transport to a known clean state before each test. */
function resetPlayer() {
  usePlayer.setState({
    queue: [],
    baseQueue: [],
    index: 0,
    isPlaying: false,
    positionSec: 0,
    volume: 80,
    muted: false,
    repeat: "off",
    shuffle: false,
    isExpanded: false,
  });
}

describe("player transport", () => {
  beforeEach(resetPlayer);

  it("plays a song within a context list", () => {
    usePlayer.getState().playSongInContext(["a", "b", "c"], "b");
    const state = usePlayer.getState();
    expect(currentSongId(state)).toBe("b");
    expect(state.isPlaying).toBe(true);
  });

  it("advances to the next track", () => {
    usePlayer.getState().playContext(["a", "b", "c"], 0);
    usePlayer.getState().next();
    expect(currentSongId(usePlayer.getState())).toBe("b");
  });

  it("stops at the end of the queue when repeat is off", () => {
    usePlayer.getState().playContext(["a", "b"], 1);
    usePlayer.getState().next();
    const state = usePlayer.getState();
    expect(state.isPlaying).toBe(false);
    expect(state.index).toBe(1);
  });

  it("wraps to the first track when repeat is 'all'", () => {
    usePlayer.getState().playContext(["a", "b"], 1);
    usePlayer.setState({ repeat: "all" });
    usePlayer.getState().next();
    expect(usePlayer.getState().index).toBe(0);
  });

  it("repeat 'one' restarts the current track at end", () => {
    usePlayer.getState().playContext(["a", "b"], 0);
    usePlayer.setState({ repeat: "one", positionSec: 42 });
    usePlayer.getState().handleTrackEnd();
    const state = usePlayer.getState();
    expect(state.index).toBe(0);
    expect(state.positionSec).toBe(0);
  });

  it("previous restarts the track when more than 3s in", () => {
    usePlayer.getState().playContext(["a", "b", "c"], 1);
    usePlayer.setState({ positionSec: 10 });
    usePlayer.getState().previous();
    const state = usePlayer.getState();
    expect(state.index).toBe(1);
    expect(state.positionSec).toBe(0);
  });

  it("previous goes back a track near the start", () => {
    usePlayer.getState().playContext(["a", "b", "c"], 2);
    usePlayer.setState({ positionSec: 1 });
    usePlayer.getState().previous();
    expect(usePlayer.getState().index).toBe(1);
  });

  it("cycles repeat mode off → all → one → off", () => {
    const { cycleRepeat } = usePlayer.getState();
    cycleRepeat();
    expect(usePlayer.getState().repeat).toBe("all");
    cycleRepeat();
    expect(usePlayer.getState().repeat).toBe("one");
    cycleRepeat();
    expect(usePlayer.getState().repeat).toBe("off");
  });

  it("shuffle keeps the current track and restores order when turned off", () => {
    usePlayer.getState().playContext(["a", "b", "c", "d"], 2); // current = "c"
    usePlayer.getState().toggleShuffle();
    let state = usePlayer.getState();
    expect(state.shuffle).toBe(true);
    expect(currentSongId(state)).toBe("c");
    expect([...state.queue].sort()).toEqual(["a", "b", "c", "d"]); // a permutation

    usePlayer.getState().toggleShuffle();
    state = usePlayer.getState();
    expect(state.shuffle).toBe(false);
    expect(state.queue).toEqual(["a", "b", "c", "d"]); // original order restored
    expect(currentSongId(state)).toBe("c");
  });

  it("clamps the volume between 0 and 100", () => {
    usePlayer.getState().setVolume(150);
    expect(usePlayer.getState().volume).toBe(100);
    usePlayer.getState().setVolume(-20);
    expect(usePlayer.getState().volume).toBe(0);
  });

  it("jumps directly to a queue index", () => {
    usePlayer.getState().playContext(["a", "b", "c"], 0);
    usePlayer.getState().jumpTo(2);
    expect(currentSongId(usePlayer.getState())).toBe("c");
  });
});
