import React, { useState, useEffect } from "react";

function ImageSlider({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = للأمام، -1 = للخلف

    // الانتقال التلقائي كل 3 ثوانٍ
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => {
                // إذا وصلنا للنهاية، نغير الاتجاه
                if (prev === images.length - 1) {
                    setDirection(-1);
                    return prev - 1;
                }
                // إذا وصلنا للبداية، نغير الاتجاه
                if (prev === 0) {
                    setDirection(1);
                    return prev + 1;
                }
                return prev + direction;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [direction, images.length]);

    const prevSlide = () => setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    const nextSlide = () => setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));

    return (
        <div id="slider" style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px' }}>
            <div
                className="carousel-inner"
                style={{ display: 'flex', transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease-in-out' }}
            >
                {images.map((img, idx) => (
                    <img key={idx} src={img} alt={`slide-${idx}`} className="slider-image"
                        style={{ width: '100%', flexShrink: 0, height: '300px', objectFit: 'cover' }} />
                ))}
            </div>

            {/* الأسهم */}
            <button className="arrow-btn arrow-left" onClick={prevSlide} style={arrowStyle('left')}>&lt;</button>
            <button className="arrow-btn arrow-right" onClick={nextSlide} style={arrowStyle('right')}>&gt;</button>
        </div>
    );
}

// CSS للأسهم داخل JSX
const arrowStyle = (position) => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [position]: '10px',
    backgroundColor: 'rgba(100, 216, 192, 0.8)',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '50%',
    zIndex: 2
});

export default ImageSlider;
