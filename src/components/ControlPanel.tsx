'use client';
import { useStore } from '@/store/useStore';
export function ControlPanel() {
    const { currentClimate, setClimateParam } = useStore();
    const roofPitch = (15 + (currentClimate.rainfall / 2000) * 45).toFixed(1);
    const eavesOverhang = (0.1 + currentClimate.sunlight * 0.7).toFixed(2);
    const windowScale = Math.max(0.17, 1 - currentClimate.defense / 12).toFixed(2);
    return (<div style={{
            position: 'fixed',
            top: 82,
            left: 20,
            width: 'min(360px, calc(100vw - 40px))',
            zIndex: 20,
            pointerEvents: 'auto',
        }}>
      <div className="guofeng-glass" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16, paddingLeft: 12, borderLeft: '3px solid var(--paper-gold)' }}>
          <h1 style={{
            margin: 0,
            fontSize: '1.45rem',
            fontWeight: 700,
            color: 'var(--paper-ink)',
            letterSpacing: '0.12em',
            fontFamily: 'var(--font-serif)',
        }}>
            形态调控
          </h1>
          <p style={{
            marginTop: 3,
            color: 'var(--paper-muted)',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.18em',
        }}>
            CLIMATE PARAMETER STUDIO
          </p>
        </div>

        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 10,
            color: 'var(--paper-muted)',
            letterSpacing: 2,
            marginBottom: 16,
            fontFamily: 'var(--font-mono)',
        }}>
          <span>ENVIRONMENTAL INPUTS</span>
          <div style={{ width: 30, height: 1, background: 'rgba(139, 104, 70, 0.2)' }}/>
        </div>

        <SliderRow icon="🌧️" label="降雨量" value={`${currentClimate.rainfall.toFixed(0)} mm`} percent={(currentClimate.rainfall / 2000) * 100} gradientColor="#5b8d86" sliderProps={{
            min: 0,
            max: 2000,
            step: 10,
            value: currentClimate.rainfall,
            onChange: (value) => setClimateParam('rainfall', value),
        }} hintLeft="干燥" hintRight="湿润"/>

        <SliderRow icon="☀️" label="日照量" value={`${(currentClimate.sunlight * 100).toFixed(0)}%`} percent={currentClimate.sunlight * 100} gradientColor="#b88a3b" sliderProps={{
            min: 0,
            max: 1,
            step: 0.01,
            value: currentClimate.sunlight,
            onChange: (value) => setClimateParam('sunlight', value),
        }}/>

        <SliderRow icon="🛡️" label="防御级" value={`Lv.${currentClimate.defense.toFixed(0)}`} percent={(currentClimate.defense / 10) * 100} gradientColor="#8b6846" sliderProps={{
            min: 0,
            max: 10,
            step: 0.5,
            value: currentClimate.defense,
            onChange: (value) => setClimateParam('defense', value),
        }}/>
      </div>

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
        <DataCard label="屋顶坡度" value={`${roofPitch}°`} accent="#5b8d86"/>
        <DataCard label="檐口挑出" value={`${eavesOverhang}m`} accent="#b88a3b"/>
        <DataCard label="开窗通透" value={`${(Number(windowScale) * 100).toFixed(0)}%`} accent="#8b6846"/>
      </div>
    </div>);
}
type SliderRowProps = {
    icon: string;
    label: string;
    value: string;
    percent: number;
    gradientColor: string;
    sliderProps: {
        min: number;
        max: number;
        step: number;
        value: number;
        onChange: (next: number) => void;
    };
    hintLeft?: string;
    hintRight?: string;
};
function SliderRow({ icon, label, value, percent, gradientColor, sliderProps, hintLeft, hintRight, }: SliderRowProps) {
    return (<div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 8 }}>
        <label style={{
            color: 'var(--paper-ink)',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
        }}>
          <span style={{ fontSize: 15 }}>{icon}</span>
          <span style={{ fontFamily: 'var(--font-serif)' }}>{label}</span>
        </label>
        <span style={{
            color: 'var(--paper-brown)',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.04em',
        }}>
          {value}
        </span>
      </div>

      <input type="range" min={sliderProps.min} max={sliderProps.max} step={sliderProps.step} value={sliderProps.value} onChange={(event) => sliderProps.onChange(Number(event.target.value))} className="guofeng-slider" style={{
            background: `linear-gradient(to right, ${gradientColor} ${percent}%, rgba(139, 104, 70, 0.14) ${percent}%)`,
        }}/>

      {(hintLeft || hintRight) && (<div style={{
                marginTop: 4,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10,
                color: 'var(--paper-muted)',
                fontFamily: 'var(--font-mono)',
            }}>
          <span>{hintLeft}</span>
          <span>{hintRight}</span>
        </div>)}
    </div>);
}
function DataCard({ label, value, accent }: {
    label: string;
    value: string;
    accent: string;
}) {
    return (<div className="guofeng-kpi" style={{ padding: '8px 6px', textAlign: 'center' }}>
      <div style={{
            fontSize: 10,
            color: 'var(--paper-muted)',
            letterSpacing: '0.04em',
            marginBottom: 3,
            whiteSpace: 'nowrap',
        }}>
        {label}
      </div>
      <div style={{
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: accent,
        }}>
        {value}
      </div>
    </div>);
}
