import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Copy, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils'; // Assuming standard shadcn/ui setup

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

const FloatingChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: window.innerHeight - 80, // Initial position bottom-right
    left: window.innerWidth - 80,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [didDrag, setDidDrag] = useState<boolean>(false); // To differentiate click vs drag

  const bubbleRef = useRef<HTMLButtonElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref for the textarea

  const bubbleSize = 56; // Approx size of the bubble button (p-4 + icon size)

  // Mock API call
  const mockApiCall = useCallback(async (userMessage: string): Promise<string> => {
    console.log('Simulating API call for:', userMessage); // Keep console log for mock simulation clarity
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Hello!'); // Simple mock response
      }, 1000);
    });
  }, []); // Empty dependency array: function doesn't depend on props/state

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll whenever messages update

  // Handle message sending
  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      sender: 'user',
      text: trimmedInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    const botResponseText = await mockApiCall(trimmedInput);

    const botMessage: Message = {
      id: Date.now().toString() + '-bot',
      sender: 'bot',
      text: botResponseText,
    };
    setMessages((prev) => [...prev, botMessage]);
  }, [inputValue, mockApiCall]); // Added mockApiCall to dependency array

  // Input change handler
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    // Adjust height on input change as well
    adjustTextareaHeight(event.target);
  };

  // Handle Enter key press in input
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Send on Enter, allow Shift+Enter for newline
      event.preventDefault(); // Prevent default newline insertion
      handleSendMessage();
    }
  };

  // Copy message text to clipboard
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optional: Show a temporary success indicator
      console.log('Copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // --- Drag Logic ---
  const handleDragStart = useCallback(
    (clientX: number, clientY: number) => {
      if (!bubbleRef.current) return;
      // e.preventDefault(); // Prevent text selection, etc. (Can interfere with input focusing later if not careful)

      const rect = bubbleRef.current.getBoundingClientRect();
      setOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
      setDragStart({ x: clientX, y: clientY });
      setIsDragging(true);
      setDidDrag(false); // Reset drag status on new mousedown/touchstart
      document.body.style.cursor = 'grabbing'; // Indicate dragging globally
    },
    []
  );

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !dragStart) return;

      setDidDrag(true); // Mark as dragged

      let newLeft = clientX - offset.x;
      let newTop = clientY - offset.y;

      // Constrain within viewport
      const bubbleWidth = bubbleRef.current?.offsetWidth ?? bubbleSize;
      const bubbleHeight = bubbleRef.current?.offsetHeight ?? bubbleSize;
      const maxX = window.innerWidth - bubbleWidth;
      const maxY = window.innerHeight - bubbleHeight;

      newLeft = Math.max(0, Math.min(newLeft, maxX));
      newTop = Math.max(0, Math.min(newTop, maxY));

      setPosition({ top: newTop, left: newLeft });
    },
    [isDragging, dragStart, offset]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return; // Avoid triggering if not actually dragging

    setIsDragging(false);
    setDragStart(null);
    document.body.style.cursor = 'default'; // Reset cursor

    // Toggle open state ONLY if it wasn't a drag
    if (!didDrag) {
        setIsOpen((prev) => !prev);
    }
    // didDrag remains true if move happened, preventing toggle
  }, [isDragging, didDrag]);


  // Mouse event handlers
  const onMouseDown = (e: React.MouseEvent) => {
    // Prevent toggle if right-clicking
    if (e.button !== 0) return;
    handleDragStart(e.clientX, e.clientY);
  };

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY);
    },
    [handleDragMove]
  );

  const onMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);


  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      // Check if touch event has touches
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    },
    [handleDragMove]
  );

  const onTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);


  // Add/remove global listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove, { passive: false }); // passive: false to allow preventDefault if needed later
      document.addEventListener('touchend', onTouchEnd);
      document.addEventListener('mouseleave', onMouseUp); // Handle mouse leaving the window during drag
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('mouseleave', onMouseUp);
    }

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('mouseleave', onMouseUp);
      document.body.style.cursor = 'default'; // Ensure cursor reset on unmount
    };
  }, [isDragging, onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  // Calculate chat window position to snap to one of four corners relative to the bubble
  const getChatWindowStyle = (): React.CSSProperties => {
    const windowWidth = 350;
    const windowHeight = 500;
    const margin = 16; // Space between bubble and window
    const screenPadding = 16; // Minimum space from screen edge

    // Get bubble dimensions (use state for position, ref for actual size if needed)
    const bubbleRect = bubbleRef.current?.getBoundingClientRect();
    const currentBubbleSize = bubbleRect ? bubbleRect.width : bubbleSize; // Use actual size if available
    const bubbleTop = position.top;
    const bubbleLeft = position.left;

    // Available space
    const spaceRight = window.innerWidth - (bubbleLeft + currentBubbleSize);
    const spaceLeft = bubbleLeft;

    // Determine horizontal placement
    let placeRight = true; // Default to right
    if (spaceLeft >= windowWidth + margin && spaceLeft > spaceRight) {
        placeRight = false; // Place left only if enough space and more than right
    } else if (spaceRight < windowWidth + margin) {
        // If not enough space on right, check left again
        if (spaceLeft >= windowWidth + margin) {
            placeRight = false;
        }
        // If neither side has enough space, it will default to right and be constrained later
    }

    // Determine vertical placement (Align window top with bubble top, or window bottom with bubble bottom)
    let alignTop = true; // Default to top alignment
    // Check if placing the window aligned to the top goes off-screen
    if (bubbleTop + windowHeight > window.innerHeight - screenPadding) {
        // If aligning top goes off bottom, check if aligning bottom works
        if (bubbleTop + currentBubbleSize - windowHeight >= screenPadding) {
             alignTop = false; // Align bottom
        }
        // If neither works well, default to top and let constraint handle it
    }

    // Calculate initial position
    let targetLeft: number;
    if (placeRight) {
        targetLeft = bubbleLeft + currentBubbleSize + margin;
    } else {
        targetLeft = bubbleLeft - windowWidth - margin;
    }

    let targetTop: number;
    if (alignTop) {
        targetTop = bubbleTop;
    } else {
        targetTop = bubbleTop + currentBubbleSize - windowHeight;
    }

    // Constrain to viewport
    const finalLeft = Math.max(
        screenPadding,
        Math.min(targetLeft, window.innerWidth - windowWidth - screenPadding)
    );
    const finalTop = Math.max(
        screenPadding,
        Math.min(targetTop, window.innerHeight - windowHeight - screenPadding)
    );

    return {
        position: 'fixed',
        top: `${finalTop}px`,
        left: `${finalLeft}px`,
        width: `${windowWidth}px`,
        height: `${windowHeight}px`,
        zIndex: 1000, // Ensure it's above other content but below bubble
    };
  };

  // Function to adjust textarea height
  const adjustTextareaHeight = (element: HTMLTextAreaElement | null) => {
    if (element) {
        element.style.height = 'auto'; // Reset height to shrink if text deleted
        element.style.height = `${element.scrollHeight}px`; // Set height to content scroll height
    }
  };

  // Adjust height when input value changes programmatically (e.g., after sending)
  useEffect(() => {
    adjustTextareaHeight(textareaRef.current);
  }, [inputValue]);

  return (
    <>
      {/* Floating Bubble */}
      <Button
        ref={bubbleRef}
        variant="default" // Use default shadcn button styling or customize
        size="icon"
        className={cn(
          'fixed rounded-full shadow-lg w-14 h-14 z-[1001]', // Ensure bubble is above chat window
          isDragging ? 'cursor-grabbing' : 'cursor-click',
          'transition-transform duration-100 ease-out', // Smooth movement slightly
           isOpen ? 'scale-95 opacity-80' : '' // Subtle indication when open
        )}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          touchAction: 'none', // Prevent scrolling on touch devices when dragging
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        // onClick is handled implicitly by the combination of drag start/end and didDrag state
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card
          ref={chatContainerRef}
          className="flex flex-col shadow-xl border animate-in fade-in zoom-in-95 duration-50 gap-0 py-4" // Added animation
          style={getChatWindowStyle()}
        >
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-card sticky top-0 pt-0 pb-0"> {/* Make header sticky */}
            <CardTitle className="text-base font-semibold">Chat Bot</CardTitle> {/* Adjusted size */}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7 p-0 hover:bg-destructive/80 hover:text-destructive-foreground"> {/* Adjusted size */}
                 <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3"> {/* Adjusted spacing */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-2 group max-w-full', // Add group for copy button hover, ensure div takes space
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                 {/* Container for message and copy button */}
                <div className={cn(
                        "flex items-center gap-1.5", // Consistent gap
                        message.sender === 'user' ? "flex-row-reverse" : "flex-row" // Correct order for user/bot
                    )}>
                    <div
                        className={cn(
                            'rounded-lg px-3 py-2 max-w-[85%]', // Max width to allow wrapping
                            message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted' // Ensure text color contrast
                        )}
                        >
                        <p className="text-sm whitespace-pre-wrap break-words"> {/* Ensure wrapping */}
                            {message.text}
                        </p>
                    </div>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 p-0 self-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" // Align button nicely, prevent shrinking
                        onClick={() => handleCopy(message.text)}
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy message</span>
                    </Button>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Target for scrolling */}
          </CardContent>
          <CardFooter className="p-3 border-t bg-card sticky pb-0 pt-0 mt-0"> {/* Make footer sticky, adjusted padding */}
            <div className="flex w-full items-end gap-2"> {/* Changed items-center to items-end */} 
              <Textarea
                ref={textareaRef}
                placeholder="Type a message..."
                className="flex-1 resize-none overflow-y-auto text-sm max-h-[120px] min-h-[40px] p-2" // Adjust max-h as needed, added min-h
                rows={1} // Start with one row
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isDragging} // Prevent input while dragging bubble
              />
              <Button
                type="submit"
                size="icon"
                className="h-9 w-9 flex-shrink-0 self-end mb-1" // Align button to bottom of textarea
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isDragging}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default FloatingChatBubble;
