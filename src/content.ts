// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'INIT_CAPTURE') {
    initializeCapture(sendResponse);
    return true;
  }
});

function initializeCapture(sendResponse: (response: any) => void) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  overlay.style.cursor = 'crosshair';
  overlay.style.zIndex = '10000';

  let selection: HTMLDivElement | null = null;
  let startX: number, startY: number;

  function handleMouseDown(e: MouseEvent) {
    startX = e.clientX;
    startY = e.clientY;

    selection = document.createElement('div');
    selection.style.position = 'fixed';
    selection.style.border = '2px solid #3b82f6';
    selection.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    selection.style.zIndex = '10001';
    
    document.body.appendChild(selection);
  }

  function handleMouseMove(e: MouseEvent) {
    if (!selection) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    selection.style.left = `${left}px`;
    selection.style.top = `${top}px`;
    selection.style.width = `${width}px`;
    selection.style.height = `${height}px`;
  }

  function handleMouseUp() {
    if (!selection) return;

    const rect = selection.getBoundingClientRect();
    selection.remove();
    overlay.remove();

    sendResponse({
      rect: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      },
    });
  }

  overlay.addEventListener('mousedown', handleMouseDown);
  overlay.addEventListener('mousemove', handleMouseMove);
  overlay.addEventListener('mouseup', handleMouseUp);

  document.body.appendChild(overlay);
}