import { useRef, useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const SignaturePad = ({ onChange, value }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.strokeStyle = '#0ea5e9';
    context.lineWidth = 2;
    context.lineCap = 'round';
    setCtx(context);

    // Initial value if provided (dataURL)
    if (value) {
      const img = new Image();
      img.onload = () => context.drawImage(img, 0, 0);
      img.src = value;
    }
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    e.preventDefault();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    e.preventDefault();
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    onChange(canvasRef.current.toDataURL());
  };

  const clear = () => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="relative border border-white/10 bg-white/5 rounded-2xl overflow-hidden cursor-crosshair group">
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="w-full h-[200px]"
        />
        <button
          type="button"
          onClick={clear}
          className="absolute top-4 right-4 p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-white/10"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center">Draw your signature above</p>
    </div>
  );
};

export default SignaturePad;
