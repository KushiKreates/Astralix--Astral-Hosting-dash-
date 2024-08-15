import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const Terminal = ({ containerId }) => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!xtermRef.current) {
      xtermRef.current = new XTerm({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        theme: {
          background: '#1e1e1e',
          foreground: '#ffffff',
        },
      });

      const fitAddon = new FitAddon();
      xtermRef.current.loadAddon(fitAddon);

      xtermRef.current.open(terminalRef.current);
      fitAddon.fit();

      // Connect to WebSocket
      const socket = new WebSocket(`ws://de-prem-01.hosts.optikservers.com:35300/${containerId}`);

      socket.onopen = () => {
        console.log(`WebSocket connected for container ${containerId}`);
      };

      socket.onmessage = (event) => {
        xtermRef.current.write(event.data);
      };

      socket.onclose = () => {
        console.log(`WebSocket disconnected for container ${containerId}`);
        // Optional: Attempt to reconnect or handle closure gracefully
      };

      socket.onerror = (error) => {
        console.error(`WebSocket error for container ${containerId}:`, error);
        // Optional: Implement error handling logic
      };

      xtermRef.current.onData((data) => {
        socket.send(data);
      });

      // Resize handler
      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });
      resizeObserver.observe(terminalRef.current);

      socketRef.current = socket;

      // Cleanup
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
        xtermRef.current.dispose();
        resizeObserver.disconnect();
      };
    }
  }, [containerId]);

  return (
    <div className="bg-gray-900 shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-white">Terminal for Container {containerId}</h2>
      <div ref={terminalRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default Terminal;
