import throttle from './throttle';

export function runner(hacks: () => void, throttleMs: number = 100): void {

  let timeout: number | undefined;

  const runHacks = throttle(throttleMs, () => {
    requestAnimationFrame(() => {
      hacks();
      schedule();
    });
  });

  function schedule() {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(runHacks, 20000);
  }

  runHacks();
}

let lastMainBoardHeight: number | undefined;

// Firefox 60- needs this to properly compute the grid layout.
export function fixMainBoardHeight(container: HTMLElement): void {
  const mainBoard = container.querySelector('.main-board') as HTMLElement;
  if (mainBoard) {
    const width = mainBoard.offsetWidth;
    console.log(lastMainBoardHeight, width);
    if (lastMainBoardHeight != width) {
      lastMainBoardHeight = width;
      mainBoard.style.height = width + 'px';
      (mainBoard.querySelector('.cg-wrap') as HTMLElement).style.height = width + 'px';
      window.lichess.dispatchEvent(document.body, 'chessground.resize');
    }
  }
}

let boundChessgroundResize = false;

export function bindChessgroundResizeOnce(f: () => void): void {
  if (!boundChessgroundResize) {
    boundChessgroundResize = true;
    document.body.addEventListener('chessground.resize', f);
  }
}

export function needsBoardHeightFix(): boolean {
  // Chrome, Chromium, Brave, Opera, Safari 12+ are OK
  if (window.chrome) return false;

  // Firefox >= 61 is OK
  const ffv = navigator.userAgent.split('Firefox/');
  return !ffv[1] || parseInt(ffv[1]) < 61;
}
