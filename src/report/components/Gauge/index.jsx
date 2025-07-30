import { useState, useRef, useEffect } from "react"

const Gauge = ({ targetValue }) => {
  const canvasRef = useRef(null);
  const [currentValue, setCurrentValue] = useState(0);
  const [animationFrame, setAnimationFrame] = useState(null);
  const [severity, setSeverity] = useState("INFO")
  const centerX = 200; // Center of the canvas
  const centerY = 200; // Adjust centerY for a shorter height
  const radius = 150;  // Adjust the radius to fit the shorter height

  const cvssGrades = [
    { label: 'INFO', color: '#00cc44', min: 0, max: 1.9 , textColor:"#000000" },
    { label: 'LOW', color: '#ffff00', min: 2.0, max: 3.9 , textColor:"#000000"},
    { label: 'MEDIUM', color: '#ffb84d', min: 4.0, max: 6.9 , textColor:"#000000" },
    { label: 'HIGH', color: '#ff4d4d', min: 7.0, max: 8.9 , textColor:"#000000"},
    { label: 'CRITICAL', color: '#cc0000', min: 9.0, max: 10.0 , textColor:"#000000" }
  ];

  const drawGauge = (ctx, value) => {
    ctx.clearRect(0, 0, 500, 400); // Adjust clearRect for new dimensions

    // Draw the arc for each CVSS grade with a thinner stroke
    let startAngle = Math.PI;
    cvssGrades.forEach(grade => {
      const endAngle = Math.PI + ((grade.max / 10) * Math.PI);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false );
      ctx.lineWidth = 10; // Thinner arc for a sleek design
      ctx.strokeStyle = grade.color;
      ctx.stroke();
      startAngle = endAngle;
    });

    // Draw grade numbers and ticks inside the arc
    drawGradeNumbersAndThinnerTicks(ctx);

    // Draw the enhanced, thinner needle based on the value
    drawNeedle(ctx, value);

    // Center Dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI); // Thinner center dot
    ctx.fillStyle = '#007bff';
    ctx.fill();
  };

  const drawGradeNumbersAndThinnerTicks = (ctx) => {
    const labelRadius = radius - 25; // Move numbers inside the arc
    const tickRadiusInner = radius - 8; // Adjust tick position to match the new arc size
    const tickLength = 6; // Thinner ticks for a sleek look

    for (let i = 0; i <= 10; i += 1) {
      const angle = Math.PI + (i / 10) * Math.PI;

      // Calculate position for the grade numbers (moved inside the arc)
      const labelX = centerX + labelRadius * Math.cos(angle);
      const labelY = centerY + labelRadius * Math.sin(angle);

      // Set font and alignment
      ctx.font = '14px Arial'; // Slightly smaller font size
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw the number (0 to 10)
      ctx.fillText(i, labelX, labelY);

      // Draw more beautiful ticks inside the arc
      const tickStartX = centerX + tickRadiusInner * Math.cos(angle);
      const tickStartY = centerY + tickRadiusInner * Math.sin(angle);
      const tickEndX = centerX + (tickRadiusInner - tickLength) * Math.cos(angle);
      const tickEndY = centerY + (tickRadiusInner - tickLength) * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(tickStartX, tickStartY);
      ctx.lineTo(tickEndX, tickEndY);
      ctx.lineWidth = 2; // Thinner ticks
      ctx.strokeStyle = i % 5 === 0 ? '#007bff' : '#bbb'; // Larger tick for every 5th number
      ctx.stroke();
    }
  };

  const drawNeedle = (ctx, value) => {
    const needleAngle = Math.PI + (value / 10) * Math.PI;
    const needleLength = radius - 30; // Adjust the needle length for the larger gauge
    const needleWidth = 4; // Thinner needle for a sleek design

    // Calculate the needle tip and base points
    const needleTipX = centerX + needleLength * Math.cos(needleAngle);
    const needleTipY = centerY + needleLength * Math.sin(needleAngle);
    const baseLeftX = centerX + needleWidth * Math.cos(needleAngle - Math.PI / 2);
    const baseLeftY = centerY + needleWidth * Math.sin(needleAngle - Math.PI / 2);
    const baseRightX = centerX + needleWidth * Math.cos(needleAngle + Math.PI / 2);
    const baseRightY = centerY + needleWidth * Math.sin(needleAngle + Math.PI / 2);

    // Create the needle as a triangle
    ctx.beginPath();
    ctx.moveTo(needleTipX, needleTipY); // Tip of the needle
    ctx.lineTo(baseLeftX, baseLeftY); // Left base
    ctx.lineTo(baseRightX, baseRightY); // Right base
    ctx.closePath();

    // Style the needle
    ctx.fillStyle = '#007bff'; // Blue needle
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 5; // Slight shadow for depth
    ctx.fill();
    ctx.shadowBlur = 0; // Remove shadow for subsequent drawings
  };

  useEffect(() => {

    if (parseFloat(targetValue) === 0) {
      setSeverity("INFO")
    }

    if (parseFloat(targetValue) >= 9.0 && parseFloat(targetValue) <= 10.0) {
      setSeverity("CRITICAL")

    }
    if (parseFloat(targetValue) >= 7.0 && parseFloat(targetValue) <= 8.9) {
      setSeverity("HIGH")

    }
    if (parseFloat(targetValue) >= 4.0 && parseFloat(targetValue) <= 6.9) {
      setSeverity("MEDIUM")

    }
    if (parseFloat(targetValue) >= 1.0 && parseFloat(targetValue) <= 3.9) {
      setSeverity("LOW")

    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Animate the gauge
    const animate = () => {
      if (currentValue < targetValue) {
        const nextValue = currentValue + 0.2; // Animation step
        setCurrentValue(nextValue > targetValue ? targetValue : nextValue);
        drawGauge(ctx, nextValue);
        setAnimationFrame(requestAnimationFrame(animate));
      } else {
        cancelAnimationFrame(animationFrame); // Stop the animation
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame); // Cleanup animation on component unmount
    };
  }, [currentValue, targetValue, animationFrame]);


  return (
    <div className="gauge-container">

      <div className="twogt">
        <canvas ref={canvasRef} width="400" height="250"></canvas> {/* Decreased canvas height */}
        
        {/* <div className="gauge-value" style={{ marginTop: '-30px', fontSize: '16px' }}>{`${currentValue.toFixed(1)}/${severity}`}</div> Moved the value closer */}

        <div className="gauge-info">

          {cvssGrades.map((grade, index) => (

            <div key={index} className={`gauge-info-item ${grade.label === severity ? 'severity' : ''}`} style={{ fontFamily: "Arial" , fontSize:"10pt",  backgroundColor: grade.color 
              , color:`${grade.label==="LOW" ? "#000000" : "#ffffff"} `}}>
              {grade.label}
            </div>

          ))}

        </div>
      </div>
    </div>
  );
};

export default Gauge