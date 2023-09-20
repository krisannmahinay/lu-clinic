import React, { useCallback, useState, useRef } from 'react'
// import ReactImageZoom from 'react-image-zoom'
import Zoom from 'react-medium-image-zoom'
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


const ImagingResult = ({ imageType, data }) => {
    const [isZoomed, setIsZoomed] = useState(false)
    const [zoomScale, setZoomScale] = useState(1)
    const [maxHeight, setMaxHeight] = useState('70vh')

    const imgRef = useRef(null)
    const result = data.find(
        (item) => item.imaging_type === imageType
    )

    const handleScroll = (e) => {
        e.preventDefault()
    
        // Zoom in or out based on the scroll direction
        const newZoomScale = e.deltaY > 0 
          ? Math.max(zoomScale - 0.1, 1) // Limiting the minimum zoom to original size
          : Math.min(zoomScale + 0.1, 3) // Let's limit the maximum zoom to 3x for now
    
        setZoomScale(newZoomScale)

        const adjustedMaxHeight = 500 * newZoomScale  // Assuming 500px is base height
        setMaxHeight(`${adjustedMaxHeight}px`)
    
        if (imgRef.current) {
          imgRef.current.style.transform = `scale(${newZoomScale})`
        }
    }
    
    const handleZoomChange = (zoomState) => {
        if (!zoomState) {
            setIsZoomed(zoomState)
        }  else {
            setIsZoomed(false);
            setZoomScale(1);
            if (imgRef.current) {
              imgRef.current.style.transform = `scale(1)`;
            }
        }
    }

    const handleImageClick = () => {
        if (!isZoomed) {
            setIsZoomed(true);
        }
    }
    
    if (!result) return null

    return (
        <div>

            <h2 className="text-xl font-bold mb-4">{imageType} Results</h2>
            <p className="text-gray-600 mb-4">Examined on: {result.date_examination}</p>
            <div className="border p-4">
                {/* <ReactImageZoom {...props} /> */}
                <div
                    className="flex justify-center border p-4 overflow-auto scroll-custom"
                    onWheel={isZoomed ? handleScroll : null}
                    style={{ maxHeight }}
                >
                    <img
                        onClick={handleImageClick}
                        ref={imgRef}
                        src={result.imaging_src}
                        alt={`${imageType} Result`}
                        // className="w-full h-auto cursor-pointer"
                        className="w-full md:w-[50vh] sm:w-full h-[50vh] transition-transform duration-300 cursor-zoom-in"
                    />
                </div>
            </div>
        </div>
    )
}

export default ImagingResult