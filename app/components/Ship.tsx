'use client';

import { useEffect, useRef } from 'react';

interface ShipProps {
  width?: number;
  height?: number;
}

export default function Ship({ width = 400, height = 400 }: ShipProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const vertexShaderSource = `
      attribute vec2 a_position;
      uniform vec2 u_resolution;
      uniform float u_rotation;
      uniform vec2 u_translation;

      void main() {
        float c = cos(u_rotation);
        float s = sin(u_rotation);
        vec2 rotated = vec2(
          a_position.x * c - a_position.y * s,
          a_position.x * s + a_position.y * c
        );

        vec2 position = rotated + u_translation;

        vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec4 u_color;

      void main() {
        gl_FragColor = u_color;
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(
      gl: WebGLRenderingContext,
      vertexShader: WebGLShader,
      fragmentShader: WebGLShader
    ) {
      const program = gl.createProgram();
      if (!program) return null;

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    const rotationUniformLocation = gl.getUniformLocation(program, 'u_rotation');
    const translationUniformLocation = gl.getUniformLocation(program, 'u_translation');

    const positionBuffer = gl.createBuffer();

    function drawShape(
      vertices: number[],
      color: number[],
      rotation = 0,
      tx = 0,
      ty = 0
    ) {
      gl?.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl?.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

      gl?.enableVertexAttribArray(positionAttributeLocation);
      gl?.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      gl?.uniform2f(resolutionUniformLocation, canvas?.width ?? 0, canvas?.height ?? 0);
      gl?.uniform4fv(colorUniformLocation, color);
      gl?.uniform1f(rotationUniformLocation, rotation);
      gl?.uniform2f(translationUniformLocation, tx, ty);

      gl?.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
    }

    let time = 0;
    let animationFrameId: number;

    function render() {
      time += 0.02;

      gl?.clearColor(0, 0, 0, 0);
      gl?.clear(gl.COLOR_BUFFER_BIT);
      gl?.useProgram(program);

      const centerX = (canvas?.width ?? 0) / 2;
      const centerY = (canvas?.height ?? 0) / 2;

      const bob = Math.sin(time) * 10;
      const sway = Math.sin(time * 0.7) * 0.05;

      const hull = [-60, 20, 60, 20, 50, 60, -60, 20, 50, 60, -50, 60];
      drawShape(hull, [0.4, 0.25, 0.1, 1], sway, centerX, centerY + bob);

      const deck = [-55, 10, 55, 10, 45, 20, -55, 10, 45, 20, -45, 20];
      drawShape(deck, [0.3, 0.15, 0.05, 1], sway, centerX, centerY + bob);

      const mast = [-5, -80, 5, -80, 5, 15, -5, -80, 5, 15, -5, 15];
      drawShape(mast, [0.35, 0.2, 0.1, 1], sway, centerX, centerY + bob);

      const mainSail = [5, -70, 50, -40, 50, -10, 5, -70, 50, -10, 5, -10];
      drawShape(
        mainSail,
        [0.9, 0.9, 0.9, 1],
        sway + Math.sin(time * 2) * 0.03,
        centerX,
        centerY + bob
      );

      const frontSail = [5, -50, 45, -30, 45, 0, 5, -50, 45, 0, 5, 0];
      drawShape(
        frontSail,
        [0.85, 0.85, 0.85, 1],
        sway + Math.sin(time * 2 + 0.5) * 0.03,
        centerX,
        centerY + bob
      );

      const skull = [20, -45, 35, -45, 27.5, -35];
      drawShape(
        skull,
        [0.1, 0.1, 0.1, 1],
        sway + Math.sin(time * 2) * 0.03,
        centerX,
        centerY + bob
      );

      const crowsNest = [-8, -75, 8, -75, 6, -70, -8, -75, 6, -70, -6, -70];
      drawShape(crowsNest, [0.3, 0.15, 0.05, 1], sway, centerX, centerY + bob);

      const flagPole = [-1, -110, 1, -110, 1, -80, -1, -110, 1, -80, -1, -80];
      drawShape(flagPole, [0.2, 0.1, 0.05, 1], sway, centerX, centerY + bob);

      const flag = [1, -105, 25, -100, 25, -90, 1, -105, 25, -90, 1, -95];
      const flagWave = Math.sin(time * 3) * 0.1;
      drawShape(flag, [0.15, 0.15, 0.15, 1], sway + flagWave, centerX, centerY + bob);

      const cannon1 = [-40, 25, -25, 25, -25, 30, -40, 25, -25, 30, -40, 30];
      drawShape(cannon1, [0.2, 0.2, 0.2, 1], sway, centerX, centerY + bob);

      const cannon2 = [25, 25, 40, 25, 40, 30, 25, 25, 40, 30, 25, 30];
      drawShape(cannon2, [0.2, 0.2, 0.2, 1], sway, centerX, centerY + bob);

      const waveOffset = Math.sin(time * 2) * 5;
      const wave1 = [-200, 65, 200, 65, 200, 70, -200, 65, 200, 70, -200, 70];
      drawShape(wave1, [0.1, 0.3, 0.5, 0.6], 0, centerX + waveOffset, centerY + bob);

      const wave2 = [-200, 70, 200, 70, 200, 75, -200, 70, 200, 75, -200, 75];
      drawShape(wave2, [0.08, 0.25, 0.45, 0.5], 0, centerX - waveOffset, centerY + bob);

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
