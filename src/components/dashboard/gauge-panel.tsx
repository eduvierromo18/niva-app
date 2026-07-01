const metrics = [
  { label: "Saldo", value: "3 mil", rotation: 0 },
  { label: "Flujo de caja", value: "0", rotation: -4 },
  { label: "Gastos", value: "0", rotation: 4 },
];

function Gauge({ rotation }: { rotation: number }) {
  return (
    <div className="relative h-36 w-36">
      <div className="absolute inset-0 rounded-full border-[18px] border-transparent border-l-red-500 border-r-emerald-400 border-t-amber-400" />
      <div className="absolute left-1/2 top-[30px] h-20 w-1 -translate-x-1/2 rounded-full bg-slate-600 shadow" style={{ transform: `translateX(-50%) rotate(${rotation}deg)`, transformOrigin: "50% 90%" }} />
      <div className="absolute left-1/2 top-[82px] h-4 w-4 -translate-x-1/2 rounded-full bg-slate-600" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-white" />
    </div>
  );
}

export function GaugePanel() {
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-950">Panel</h3>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col items-center">
            <Gauge rotation={metric.rotation} />
            <p className="mt-1 text-sm font-bold uppercase text-slate-500">{metric.label}</p>
            <p className="text-2xl font-bold text-slate-950">{metric.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

