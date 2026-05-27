// ── URL base da API Spring Boot ──────────────────────────────────────────────
const API = 'http://localhost:8080';

// ── NAVEGAÇÃO ─────────────────────────────────────────────────────────────────
function goTo(pageId, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  btn.classList.add('active');
}

// ── TOAST (notificação) ───────────────────────────────────────────────────────
function toast(msg, tipo = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast-${tipo}`;
  t.innerHTML = tipo === 'success'
    ? `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> ${msg}`
    : `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── UTILITÁRIOS ───────────────────────────────────────────────────────────────
function initials(nome) {
  const parts = (nome || '?').split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

// ── FUNÇÃO GENÉRICA DE REQUISIÇÃO HTTP ───────────────────────────────────────
async function req(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Erro ${res.status}`);
  }
  return res.json();
}

// ── ALUNOS ────────────────────────────────────────────────────────────────────
async function cadastrarAluno() {
  const nome        = document.getElementById('aluno-nome').value.trim();
  const endereco    = document.getElementById('aluno-endereco').value.trim();
  const matricula   = document.getElementById('aluno-matricula').value.trim();
  const dataIngresso = document.getElementById('aluno-data').value;

  if (!nome || !matricula || !dataIngresso) {
    toast('Preencha nome, matrícula e data de ingresso.', 'error');
    return;
  }

  try {
    const data = await req('POST', '/alunos', { nome, endereco, matricula, dataIngresso });
    toast(`Aluno "${data.nome}" cadastrado com sucesso! (ID: ${data.id})`);
    ['aluno-nome', 'aluno-endereco', 'aluno-matricula', 'aluno-data']
      .forEach(id => document.getElementById(id).value = '');
  } catch (e) {
    toast('Erro: ' + e.message, 'error');
  }
}

async function buscarAluno() {
  const matricula = document.getElementById('busca-matricula').value.trim();
  if (!matricula) { toast('Digite uma matrícula.', 'error'); return; }

  const el = document.getElementById('resultado-aluno');
  el.innerHTML = '<div style="padding:1rem; color:var(--muted); font-size:13.5px;">Buscando...</div>';

  try {
    const d = await req('GET', `/alunos/matricula/${matricula}`);

    const materias = d.materias && d.materias.length > 0
      ? d.materias.map(m => {
          const med = parseFloat(m.media).toFixed(2);
          const ap  = parseFloat(m.media) >= 6;
          return `<tr>
            <td>${m.materia}</td>
            <td class="mono">${med}</td>
            <td><span class="badge ${ap ? 'badge-success' : 'badge-danger'}">${ap ? 'Aprovado' : 'Reprovado'}</span></td>
          </tr>`;
        }).join('')
      : `<tr><td colspan="3" style="text-align:center; color:var(--muted); font-size:13px; padding:1rem;">Nenhuma matéria matriculada</td></tr>`;

    const dataFmt = d.dataIngresso
      ? new Date(d.dataIngresso + 'T00:00:00').toLocaleDateString('pt-BR')
      : '—';

    el.innerHTML = `
      <div class="result-card">
        <div class="result-header">
          <div class="avatar">${initials(d.nome)}</div>
          <div>
            <h3>${d.nome}</h3>
            <p>Matrícula: <span class="mono">${d.matricula}</span></p>
          </div>
        </div>
        <div class="result-body">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Endereço</div>
              <div class="info-value">${d.endereco || '—'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Data de ingresso</div>
              <div class="info-value">${dataFmt}</div>
            </div>
          </div>
          <div class="section-title">Matérias e notas</div>
          <table>
            <thead><tr><th>Matéria</th><th>Média</th><th>Situação</th></tr></thead>
            <tbody>${materias}</tbody>
          </table>
        </div>
      </div>`;
  } catch (e) {
    el.innerHTML = `<div class="result-card" style="padding:1.25rem; color:var(--danger); font-size:13.5px;">
      ❌ Aluno não encontrado para a matrícula <strong>${matricula}</strong>.
    </div>`;
  }
}

// ── MATÉRIAS ──────────────────────────────────────────────────────────────────
async function cadastrarMateria() {
  const codigo = document.getElementById('materia-codigo').value.trim();
  const nome   = document.getElementById('materia-nome').value.trim();
  const ementa = document.getElementById('materia-ementa').value.trim();

  if (!codigo || !nome) { toast('Preencha código e nome da matéria.', 'error'); return; }

  try {
    const data = await req('POST', '/materias', { codigo, nome, ementa });
    toast(`Matéria "${data.nome}" cadastrada! (Código: ${data.codigo})`);
    ['materia-codigo', 'materia-nome', 'materia-ementa']
      .forEach(id => document.getElementById(id).value = '');
  } catch (e) {
    toast('Erro: ' + e.message, 'error');
  }
}

async function buscarMateria() {
  const codigo = document.getElementById('busca-materia').value.trim();
  if (!codigo) { toast('Digite um código.', 'error'); return; }

  const el = document.getElementById('resultado-materia');
  el.innerHTML = '<div style="padding:1rem; color:var(--muted); font-size:13.5px;">Buscando...</div>';

  try {
    const d = await req('GET', `/materias/codigo/${codigo}`);
    el.innerHTML = `
      <div class="result-card">
        <div class="result-header">
          <div class="avatar" style="background:#1e6b3c; border-radius:8px; font-size:12px;">MAT</div>
          <div>
            <h3>${d.nome}</h3>
            <p>Código: <span class="mono">${d.codigo}</span></p>
          </div>
        </div>
        <div class="result-body">
          <div class="section-title">Ementa</div>
          <p style="font-size:14px; line-height:1.7; color:var(--text);">
            ${d.ementa || '<em style="color:var(--muted)">Sem ementa cadastrada</em>'}
          </p>
        </div>
      </div>`;
  } catch (e) {
    el.innerHTML = `<div class="result-card" style="padding:1.25rem; color:var(--danger); font-size:13.5px;">
      ❌ Matéria não encontrada para o código <strong>${codigo}</strong>.
    </div>`;
  }
}

// ── TURMAS ────────────────────────────────────────────────────────────────────
async function cadastrarTurma() {
  const codigo = document.getElementById('turma-codigo').value.trim();
  if (!codigo) { toast('Informe o código da turma.', 'error'); return; }

  try {
    const data = await req('POST', '/turmas', { codigo });
    toast(`Turma "${data.codigo}" cadastrada com sucesso!`);
    document.getElementById('turma-codigo').value = '';
  } catch (e) {
    toast('Erro: ' + e.message, 'error');
  }
}

async function buscarTurma() {
  const codigo = document.getElementById('busca-turma').value.trim();
  if (!codigo) { toast('Digite o código da turma.', 'error'); return; }

  const el = document.getElementById('resultado-turma');
  el.innerHTML = '<div style="padding:1rem; color:var(--muted); font-size:13.5px;">Buscando...</div>';

  try {
    const d = await req('GET', `/turmas/codigo/${codigo}`);

    const alunos = d.alunos && d.alunos.length > 0
      ? d.alunos.map(a => {
          const ap  = parseFloat(a.media) >= 6;
          const med = parseFloat(a.media).toFixed(2);
          return `<tr>
            <td>${a.aluno}</td>
            <td class="mono">${parseFloat(a.nota1).toFixed(1)}</td>
            <td class="mono">${parseFloat(a.nota2).toFixed(1)}</td>
            <td class="mono">${parseFloat(a.nota3).toFixed(1)}</td>
            <td class="mono"><strong>${med}</strong></td>
            <td><span class="badge ${ap ? 'badge-success' : 'badge-danger'}">${ap ? 'Aprovado' : 'Reprovado'}</span></td>
          </tr>`;
        }).join('')
      : `<tr><td colspan="6" style="text-align:center; color:var(--muted); font-size:13px; padding:1rem;">Nenhum aluno nesta turma</td></tr>`;

    el.innerHTML = `
      <div class="result-card">
        <div class="result-header">
          <div class="avatar" style="background:#7a4f0a; border-radius:8px; font-size:11px;">TUR</div>
          <div>
            <h3>Turma <span class="mono">${d.codigo}</span></h3>
            <p>${d.alunos ? d.alunos.length : 0} aluno(s) matriculado(s)</p>
          </div>
        </div>
        <div class="result-body">
          <div class="section-title">Alunos e desempenho</div>
          <table>
            <thead>
              <tr><th>Aluno</th><th>Nota 1</th><th>Nota 2</th><th>Nota 3</th><th>Média</th><th>Situação</th></tr>
            </thead>
            <tbody>${alunos}</tbody>
          </table>
        </div>
      </div>`;
  } catch (e) {
    el.innerHTML = `<div class="result-card" style="padding:1.25rem; color:var(--danger); font-size:13.5px;">
      ❌ Turma não encontrada para o código <strong>${codigo}</strong>.
    </div>`;
  }
}

// ── MATRÍCULAS ────────────────────────────────────────────────────────────────
async function matricularAluno() {
  const alunoId   = document.getElementById('mat-aluno-id').value;
  const materiaId = document.getElementById('mat-materia-id').value;
  const nota1     = parseFloat(document.getElementById('mat-nota1').value);
  const nota2     = parseFloat(document.getElementById('mat-nota2').value);
  const nota3     = parseFloat(document.getElementById('mat-nota3').value);

  if (!alunoId || !materiaId || isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
    toast('Preencha todos os campos.', 'error');
    return;
  }

  try {
    await req('POST', `/alunos/${alunoId}/matriculas`, {
      materia: { id: parseInt(materiaId) },
      nota1, nota2, nota3
    });
    toast('Matrícula realizada com sucesso!');
    ['mat-aluno-id', 'mat-materia-id', 'mat-nota1', 'mat-nota2', 'mat-nota3']
      .forEach(id => document.getElementById(id).value = '');
    document.getElementById('media-preview').style.display = 'none';
  } catch (e) {
    toast('Erro: ' + e.message, 'error');
  }
}

// ── PREVIEW DE MÉDIA (cálculo em tempo real) ──────────────────────────────────
['mat-nota1', 'mat-nota2', 'mat-nota3'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    const n1   = parseFloat(document.getElementById('mat-nota1').value);
    const n2   = parseFloat(document.getElementById('mat-nota2').value);
    const n3   = parseFloat(document.getElementById('mat-nota3').value);
    const prev = document.getElementById('media-preview');

    if (!isNaN(n1) && !isNaN(n2) && !isNaN(n3)) {
      const media = ((n1 + n2 + n3) / 3).toFixed(2);
      const ap    = parseFloat(media) >= 6;

      document.getElementById('media-valor').textContent = media;
      const st = document.getElementById('media-status');
      st.textContent = ap ? 'Aprovado' : 'Reprovado';
      st.className   = `badge ${ap ? 'badge-success' : 'badge-danger'}`;
      prev.style.display = 'block';
    } else {
      prev.style.display = 'none';
    }
  });
});
