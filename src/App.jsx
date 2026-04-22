import { useState, useMemo, useRef } from "react";

const TEAM = [
  { id: "ma", name: "Jack",       short: "软件", color: "#3b82f6" },
  { id: "bio1", name: "Jingling", short: "生物", color: "#10b981" },
  { id: "ee", name: "John",       short: "电子", color: "#f43f5e" },
  { id: "me1", name: "Mona",      short: "机生", color: "#10b981" },
  { id: "cs", name: "Nero",       short: "软件", color: "#a855f7" },
  { id: "bio2", name: "Roger",    short: "生物", color: "#f43f5e" },
  { id: "me2", name: "Russell",   short: "机械", color: "#3b82f6" },
  { id: "bio3", name: "Yubin",    short: "生物", color: "#f97316" },
];

const STATUS_OPTIONS = [
  { value: "done", label: "已完成", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  { value: "on-track", label: "正常推进", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  { value: "at-risk", label: "有风险", color: "#eab308", bg: "rgba(234,179,8,0.12)" },
  { value: "blocked", label: "受阻/延期", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  { value: "not-started", label: "未开始", color: "#64748b", bg: "rgba(100,116,139,0.1)" },
];

const makeDate = (y, m, d) => new Date(y, m - 1, d);

const INITIAL_PROJECTS = [
  {
    id: "p1", name: "AGD", color: "#3b82f6",
    milestones: [
      { id: "p1m1", name: "开模", owners: ["bio1", "mebio"], status: "done", start: makeDate(2026, 1, 6), end: makeDate(2026, 1, 25), note: "" },
      { id: "p1m2", name: "生物方案设计", owners: ["bio1", "bio2"], status: "done", start: makeDate(2026, 1, 26), end: makeDate(2026, 2, 15), note: "" },
      { id: "p1m3", name: "机械结构设计", owners: ["me1", "mebio"], status: "done", start: makeDate(2026, 2, 9), end: makeDate(2026, 3, 8), note: "" },
      { id: "p1m4", name: "电子模块开发", owners: ["ee1"], status: "on-track", start: makeDate(2026, 3, 2), end: makeDate(2026, 4, 12), note: "" },
      { id: "p1m5", name: "软件系统开发", owners: ["sw1"], status: "on-track", start: makeDate(2026, 3, 9), end: makeDate(2026, 4, 26), note: "" },
      { id: "p1m6", name: "样机组装联调", owners: ["me1", "ee1", "sw1"], status: "not-started", start: makeDate(2026, 4, 27), end: makeDate(2026, 5, 24), note: "" },
      { id: "p1m7", name: "生物验证测试", owners: ["bio1", "bio2", "mebio"], status: "not-started", start: makeDate(2026, 5, 25), end: makeDate(2026, 6, 21), note: "" },
    ],
  },
  {
    id: "p2", name: "项目二", color: "#a855f7",
    milestones: [
      { id: "p2m1", name: "可行性调研", owners: ["bio2", "mebio"], status: "done", start: makeDate(2026, 2, 2), end: makeDate(2026, 2, 22), note: "" },
      { id: "p2m2", name: "技术路线评审", owners: ["bio1", "me1"], status: "done", start: makeDate(2026, 2, 23), end: makeDate(2026, 3, 8), note: "" },
      { id: "p2m3", name: "检测模块开发", owners: ["bio1", "ee1"], status: "blocked", start: makeDate(2026, 3, 9), end: makeDate(2026, 4, 5), note: "等待试剂供应商交付，预计延期2周" },
      { id: "p2m4", name: "流控系统设计", owners: ["me1", "mebio"], status: "at-risk", start: makeDate(2026, 3, 23), end: makeDate(2026, 4, 26), note: "依赖检测模块接口定义" },
      { id: "p2m5", name: "软件适配", owners: ["sw1"], status: "not-started", start: makeDate(2026, 4, 20), end: makeDate(2026, 5, 17), note: "" },
      { id: "p2m6", name: "系统集成测试", owners: ["me1", "ee1", "bio2"], status: "not-started", start: makeDate(2026, 5, 18), end: makeDate(2026, 6, 14), note: "" },
    ],
  },
  {
    id: "p3", name: "项目三", color: "#f97316",
    milestones: [
      { id: "p3m1", name: "市场需求调研", owners: ["mebio"], status: "done", start: makeDate(2026, 3, 2), end: makeDate(2026, 3, 15), note: "" },
      { id: "p3m2", name: "概念方案设计", owners: ["bio1", "me1"], status: "on-track", start: makeDate(2026, 3, 16), end: makeDate(2026, 4, 12), note: "" },
      { id: "p3m3", name: "关键技术验证", owners: ["bio2", "ee1"], status: "not-started", start: makeDate(2026, 4, 13), end: makeDate(2026, 5, 10), note: "" },
      { id: "p3m4", name: "原型开发", owners: ["me1", "sw1", "ee1"], status: "not-started", start: makeDate(2026, 5, 11), end: makeDate(2026, 6, 21), note: "" },
      { id: "p3m5", name: "功能测试", owners: ["bio1", "bio2", "mebio"], status: "not-started", start: makeDate(2026, 6, 22), end: makeDate(2026, 7, 19), note: "" },
    ],
  },
];

// Generate weeks from a global start to end
function generateWeeks(projects) {
  let minD = new Date(2026, 0, 5);
  let maxD = new Date(2026, 0, 5);
  projects.forEach(p => p.milestones.forEach(m => {
    if (m.start < minD) minD = new Date(m.start);
    if (m.end > maxD) maxD = new Date(m.end);
  }));
  // Align to Monday
  const startMon = new Date(minD);
  startMon.setDate(startMon.getDate() - ((startMon.getDay() + 6) % 7));
  const endFri = new Date(maxD);
  endFri.setDate(endFri.getDate() + 7);
  const weeks = [];
  let cur = new Date(startMon);
  while (cur < endFri) {
    weeks.push(new Date(cur));
    cur.setDate(cur.getDate() + 7);
  }
  return weeks;
}

function getMonthHeaders(weeks) {
  const months = [];
  let cur = null;
  weeks.forEach((w, i) => {
    const key = `${w.getFullYear()}-${w.getMonth()}`;
    if (key !== cur) {
      cur = key;
      months.push({ index: i, label: `${w.getFullYear()}年${w.getMonth() + 1}月` });
    }
  });
  return months;
}

const CELL_W = 56;
const ROW_H = 44;
const LEFT_W = 320;

export default function GanttDashboard() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [hoveredMs, setHoveredMs] = useState(null);
  const [editingMs, setEditingMs] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [filter, setFilter] = useState("all"); // all, blocked, at-risk
  const scrollRef = useRef(null);

  const weeks = useMemo(() => generateWeeks(projects), [projects]);
  const monthHeaders = useMemo(() => getMonthHeaders(weeks), [weeks]);
  const today = new Date();
  const todayWeekIdx = weeks.findIndex(w => {
    const end = new Date(w);
    end.setDate(end.getDate() + 7);
    return today >= w && today < end;
  });

  const updateMilestone = (projId, msId, updates) => {
    setProjects(prev => prev.map(p => p.id === projId ? {
      ...p, milestones: p.milestones.map(m => m.id === msId ? { ...m, ...updates } : m)
    } : p));
  };

  const getBarPosition = (ms) => {
    const startIdx = weeks.findIndex(w => {
      const wEnd = new Date(w); wEnd.setDate(wEnd.getDate() + 7);
      return ms.start < wEnd && ms.start >= w;
    });
    const endIdx = weeks.findIndex(w => {
      const wEnd = new Date(w); wEnd.setDate(wEnd.getDate() + 7);
      return ms.end < wEnd && ms.end >= w;
    });
    const s = Math.max(0, startIdx === -1 ? 0 : startIdx);
    const e = Math.max(s, endIdx === -1 ? weeks.length - 1 : endIdx);
    return { left: s * CELL_W + 4, width: (e - s + 1) * CELL_W - 8 };
  };

  // Stats
  const totalMs = projects.reduce((s, p) => s + p.milestones.length, 0);
  const blockedMs = projects.reduce((s, p) => s + p.milestones.filter(m => m.status === "blocked").length, 0);
  const atRiskMs = projects.reduce((s, p) => s + p.milestones.filter(m => m.status === "at-risk").length, 0);
  const doneMs = projects.reduce((s, p) => s + p.milestones.filter(m => m.status === "done").length, 0);

  // Filtered milestones
  const shouldShow = (ms) => {
    if (filter === "all") return true;
    return ms.status === filter;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafbfc", fontFamily: "'DM Sans', 'Noto Sans SC', system-ui, sans-serif", color: "#1a1a2e" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .gantt-row:hover { background: #f1f5f9 !important; }
        select:focus, input:focus, textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        ::-webkit-scrollbar { height: 8px; width: 8px; } ::-webkit-scrollbar-track { background: #f1f5f9; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .owner-tag { display: inline-flex; align-items: center; gap: 3px; padding: 1px 6px; border-radius: 3px; font-size: 10px; font-weight: 500; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: "#0f172a" }}>项目进度总览</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>生物检测仪器研发 · {today.getFullYear()}年{today.getMonth()+1}月{today.getDate()}日</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { key: "all", label: "全部", count: totalMs },
            { key: "blocked", label: "受阻", count: blockedMs },
            { key: "at-risk", label: "有风险", count: atRiskMs },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "6px 14px", borderRadius: 6, border: "1px solid",
              borderColor: filter === f.key ? (f.key === "blocked" ? "#fca5a5" : f.key === "at-risk" ? "#fde047" : "#93c5fd") : "#e2e8f0",
              background: filter === f.key ? (f.key === "blocked" ? "rgba(239,68,68,0.08)" : f.key === "at-risk" ? "rgba(234,179,8,0.08)" : "rgba(59,130,246,0.06)") : "#fff",
              color: filter === f.key ? (f.key === "blocked" ? "#dc2626" : f.key === "at-risk" ? "#a16207" : "#1d4ed8") : "#64748b",
              fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s"
            }}>{f.label} ({f.count})</button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ padding: "16px 28px", display: "flex", gap: 12 }}>
        {projects.map(p => {
          const done = p.milestones.filter(m => m.status === "done").length;
          const pct = Math.round((done / p.milestones.length) * 100);
          const blocked = p.milestones.filter(m => m.status === "blocked");
          return (
            <div key={p.id} style={{ flex: 1, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 18px", borderLeft: `3px solid ${p.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: p.color, fontFamily: "'DM Mono', monospace" }}>{pct}%</span>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 4, height: 4, marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: p.color, borderRadius: 4, transition: "width 0.4s ease" }} />
              </div>
              {blocked.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 11, color: "#dc2626" }}>
                  ⚠ {blocked.map(b => b.name).join("、")} 受阻
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Gantt area */}
      <div style={{ padding: "0 28px 28px", display: "flex" }}>
        {/* Left panel - milestone list */}
        <div style={{ width: LEFT_W, flexShrink: 0, background: "#fff", border: "1px solid #e2e8f0", borderRight: "none", borderRadius: "10px 0 0 10px", overflow: "hidden" }}>
          {/* Left header */}
          <div style={{ height: 56, borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", padding: "0 16px", background: "#f8fafc" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>里程碑 / 负责人</span>
          </div>

          {projects.map(proj => {
            const isCollapsed = collapsed[proj.id];
            const visibleMs = proj.milestones.filter(shouldShow);
            return (
              <div key={proj.id}>
                {/* Project header row */}
                <div onClick={() => setCollapsed(prev => ({ ...prev, [proj.id]: !prev[proj.id] }))}
                  style={{ height: ROW_H, display: "flex", alignItems: "center", padding: "0 16px", gap: 8, cursor: "pointer", borderBottom: "1px solid #f1f5f9", background: "#fafbfc" }}>
                  <span style={{ fontSize: 10, color: "#94a3b8", transition: "transform 0.2s", transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}>▼</span>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: proj.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{proj.name}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: "auto" }}>{proj.milestones.filter(m=>m.status==="done").length}/{proj.milestones.length}</span>
                </div>
                {/* Milestone rows */}
                {!isCollapsed && visibleMs.map(ms => {
                  const st = STATUS_OPTIONS.find(s => s.value === ms.status);
                  return (
                    <div key={ms.id} className="gantt-row"
                      onClick={() => setEditingMs(editingMs === ms.id ? null : ms.id)}
                      style={{ height: editingMs === ms.id ? "auto" : ROW_H, minHeight: ROW_H, display: "flex", flexDirection: "column", justifyContent: "center", padding: "6px 16px 6px 32px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", transition: "background 0.1s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: st.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ms.name}</span>
                      </div>
                      <div style={{ display: "flex", gap: 3, marginTop: 3, flexWrap: "wrap" }}>
                        {ms.owners.map(oid => {
                          const t = TEAM.find(x => x.id === oid);
                          return t ? (
                            <span key={oid} className="owner-tag" style={{ background: `${t.color}15`, color: t.color }}>
                              {t.short}
                            </span>
                          ) : null;
                        })}
                      </div>
                      {/* Inline edit panel */}
                      {editingMs === ms.id && (
                        <div style={{ marginTop: 8, padding: 10, background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0", animation: "fadeIn 0.2s ease" }}
                          onClick={e => e.stopPropagation()}>
                          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                            <div style={{ flex: 1, minWidth: 100 }}>
                              <label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 3 }}>状态</label>
                              <select value={ms.status} onChange={e => updateMilestone(proj.id, ms.id, { status: e.target.value })}
                                style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 4, background: "#fff" }}>
                                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                              </select>
                            </div>
                            <div style={{ flex: 1, minWidth: 100 }}>
                              <label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 3 }}>负责人</label>
                              <select multiple value={ms.owners} onChange={e => {
                                const vals = Array.from(e.target.selectedOptions, o => o.value);
                                updateMilestone(proj.id, ms.id, { owners: vals });
                              }} style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 4, background: "#fff", height: 52 }}>
                                {TEAM.map(t => <option key={t.id} value={t.id}>{t.short}</option>)}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 3 }}>备注/阻塞原因</label>
                            <textarea value={ms.note} onChange={e => updateMilestone(proj.id, ms.id, { note: e.target.value })}
                              rows={2} placeholder="如有延期或阻塞原因写在这里..."
                              style={{ width: "100%", padding: "4px 6px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 4, background: "#fff", resize: "vertical", boxSizing: "border-box" }} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Right panel - Gantt bars */}
        <div ref={scrollRef} style={{ flex: 1, overflow: "auto", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "0 10px 10px 0" }}>
          <div style={{ minWidth: weeks.length * CELL_W, position: "relative" }}>
            {/* Month headers */}
            <div style={{ height: 24, display: "flex", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, zIndex: 3 }}>
              {monthHeaders.map((mh, i) => {
                const nextIdx = i < monthHeaders.length - 1 ? monthHeaders[i + 1].index : weeks.length;
                const span = nextIdx - mh.index;
                return (
                  <div key={i} style={{ width: span * CELL_W, fontSize: 11, fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", paddingLeft: 8, borderRight: "1px solid #e2e8f0", boxSizing: "border-box" }}>
                    {mh.label}
                  </div>
                );
              })}
            </div>

            {/* Week headers */}
            <div style={{ height: 32, display: "flex", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 24, zIndex: 3 }}>
              {weeks.map((w, i) => {
                const isToday = i === todayWeekIdx;
                return (
                  <div key={i} style={{
                    width: CELL_W, flexShrink: 0, fontSize: 10, color: isToday ? "#1d4ed8" : "#94a3b8", fontWeight: isToday ? 600 : 400,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRight: "1px solid #f1f5f9", boxSizing: "border-box",
                    background: isToday ? "rgba(59,130,246,0.06)" : "transparent",
                    fontFamily: "'DM Mono', monospace"
                  }}>
                    {w.getMonth() + 1}/{w.getDate()}
                  </div>
                );
              })}
            </div>

            {/* Today line */}
            {todayWeekIdx >= 0 && (
              <div style={{
                position: "absolute", top: 56, bottom: 0,
                left: todayWeekIdx * CELL_W + CELL_W / 2, width: 2,
                background: "#3b82f6", zIndex: 2, opacity: 0.5
              }}>
                <div style={{ position: "absolute", top: -6, left: -8, background: "#3b82f6", color: "#fff", fontSize: 9, fontWeight: 600, padding: "1px 5px", borderRadius: 3 }}>今天</div>
              </div>
            )}

            {/* Rows */}
            {projects.map(proj => {
              const isCollapsed = collapsed[proj.id];
              const visibleMs = proj.milestones.filter(shouldShow);
              return (
                <div key={proj.id}>
                  {/* Project header spacer */}
                  <div style={{ height: ROW_H, borderBottom: "1px solid #f1f5f9", background: "#fafbfc" }} />
                  {/* Milestone bars */}
                  {!isCollapsed && visibleMs.map(ms => {
                    const st = STATUS_OPTIONS.find(s => s.value === ms.status);
                    const bar = getBarPosition(ms);
                    const isHovered = hoveredMs === ms.id;
                    const isEditing = editingMs === ms.id;
                    const rowH = isEditing ? ROW_H + 120 : ROW_H;
                    return (
                      <div key={ms.id} style={{ height: rowH, position: "relative", borderBottom: "1px solid #f1f5f9" }}>
                        {/* Grid lines */}
                        {weeks.map((_, i) => (
                          <div key={i} style={{
                            position: "absolute", left: i * CELL_W, top: 0, bottom: 0, width: CELL_W,
                            borderRight: "1px solid #f8fafc", boxSizing: "border-box"
                          }} />
                        ))}
                        {/* Bar */}
                        <div
                          onMouseEnter={() => setHoveredMs(ms.id)}
                          onMouseLeave={() => setHoveredMs(null)}
                          style={{
                            position: "absolute", top: 10, left: bar.left, width: bar.width, height: 24,
                            background: ms.status === "done"
                              ? `linear-gradient(90deg, ${st.color}, ${st.color}dd)`
                              : ms.status === "blocked"
                              ? `repeating-linear-gradient(135deg, ${st.bg}, ${st.bg} 4px, rgba(239,68,68,0.25) 4px, rgba(239,68,68,0.25) 8px)`
                              : st.bg,
                            border: `1px solid ${st.color}40`,
                            borderRadius: 5,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                            fontSize: 10, fontWeight: 500,
                            color: ms.status === "done" ? "#fff" : st.color,
                            transition: "box-shadow 0.15s, transform 0.15s",
                            boxShadow: isHovered ? `0 2px 8px ${st.color}30` : "none",
                            transform: isHovered ? "translateY(-1px)" : "none",
                            zIndex: 1, cursor: "default", overflow: "hidden", whiteSpace: "nowrap",
                            paddingLeft: 6, paddingRight: 6,
                          }}>
                          {bar.width > 80 && <span>{ms.name}</span>}
                          {ms.status === "blocked" && <span>🚫</span>}
                          {ms.status === "at-risk" && <span>⚠️</span>}
                        </div>
                        {/* Tooltip */}
                        {isHovered && (
                          <div style={{
                            position: "absolute", top: 38, left: Math.min(bar.left, (weeks.length - 4) * CELL_W),
                            background: "#1e293b", color: "#e2e8f0", borderRadius: 8, padding: 12,
                            fontSize: 11, zIndex: 10, width: 240, boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                            animation: "fadeIn 0.15s ease", lineHeight: 1.6
                          }}>
                            <div style={{ fontWeight: 600, marginBottom: 4, color: "#fff" }}>{ms.name}</div>
                            <div>状态：<span style={{ color: st.color }}>{st.label}</span></div>
                            <div>周期：{ms.start.getMonth()+1}/{ms.start.getDate()} → {ms.end.getMonth()+1}/{ms.end.getDate()}</div>
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                              负责：{ms.owners.map(oid => {
                                const t = TEAM.find(x => x.id === oid);
                                return t ? <span key={oid} style={{ color: t.color, fontWeight: 500 }}>{t.short}</span> : null;
                              }).reduce((prev, curr, i) => i === 0 ? [curr] : [...prev, <span key={`sep-${i}`} style={{color:"#475569"}}> · </span>, curr], [])}
                            </div>
                            {ms.note && <div style={{ marginTop: 6, padding: "4px 8px", background: "rgba(239,68,68,0.15)", borderRadius: 4, color: "#fca5a5" }}>📌 {ms.note}</div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "0 28px 20px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>图例：</span>
        {STATUS_OPTIONS.map(s => (
          <div key={s.value} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
            {s.label}
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8" }}>
          点击左侧里程碑可编辑状态和负责人
        </div>
      </div>

      {/* Person workload summary */}
      <div style={{ padding: "0 28px 28px" }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: "#0f172a" }}>人员负载一览</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
            {TEAM.map(t => {
              const involved = projects.flatMap(p => p.milestones.filter(m => m.owners.includes(t.id)).map(m => ({
                proj: p.name, ms: m.name, status: m.status, projColor: p.color
              })));
              const activeCount = involved.filter(x => x.status === "on-track" || x.status === "at-risk" || x.status === "blocked").length;
              const blockedItems = involved.filter(x => x.status === "blocked");
              return (
                <div key={t.id} style={{ background: "#fafbfc", borderRadius: 8, padding: 12, border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{t.short}</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: t.color, fontFamily: "'DM Mono', monospace" }}>{activeCount}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>个进行中任务</div>
                  {blockedItems.length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 10, color: "#ef4444" }}>
                      🚫 {blockedItems.map(b => b.ms).join("、")}
                    </div>
                  )}
                  <div style={{ marginTop: 6, display: "flex", gap: 3, flexWrap: "wrap" }}>
                    {[...new Set(involved.map(x => x.proj))].map(pn => {
                      const pc = involved.find(x => x.proj === pn)?.projColor;
                      return <span key={pn} style={{ fontSize: 9, background: `${pc}15`, color: pc, padding: "1px 5px", borderRadius: 3, fontWeight: 500 }}>{pn}</span>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
