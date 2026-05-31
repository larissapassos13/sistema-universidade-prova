// ── URL base da API ─────────────────────────────────────────
const API = 'http://localhost:8080';

// ── NAVEGAÇÃO ────────────────────────────────────────────────
function goTo(pageId, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  if (btn) btn.classList.add('active');
}

// ── TOAST ─────────────────────────────────────────────────────
function toast(msg, tipo = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast-${tipo}`;
  t.innerHTML = `<span>${tipo === 'success' ? '✔' : '✖'}</span> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.transition = 'opacity .3s';
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

// ── FETCH SEGURO ──────────────────────────────────────────────
async function req(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    throw new Error(
      (data && data.message) ||
      (typeof data === 'string' ? data : JSON.stringify(data)) ||
      'Erro na requisição'
    );
  }
  return data;
}

// ── HELPERS ───────────────────────────────────────────────────
function fmt(v) {
  return v != null ? Number(v).toFixed(1) : '—';
}

function badgeStatus(aprovado) {
  return aprovado
    ? `<span class="badge badge-success">✔ Aprovado</span>`
    : `<span class="badge badge-danger">✖ Reprovado</span>`;
}

function iniciais(nome) {
  return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function limpar(...ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ══════════════════════════════════════════════════════════════
// MÓDULO — ALUNO
// ══════════════════════════════════════════════════════════════

async function cadastrarAluno() {
  const nome        = document.getElementById('aluno-nome').value.trim();
  const endereco    = document.getElementById('aluno-endereco').value.trim();
  const matricula   = document.getElementById('aluno-matricula').value.trim();
  const dataIngresso = document.getElementById('aluno-data').value;

  if (!nome || !matricula || !dataIngresso) {
    return toast('Preencha nome, matrícula e data de ingresso.', 'error');
  }

  try {
    const data = await req('POST', '/alunos', { nome, endereco, matricula, dataIngresso });
    toast(`Aluno cadastrado com sucesso! ID interno: ${data.id}`);
    limpar('aluno-nome', 'aluno-endereco', 'aluno-matricula', 'aluno-data');
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ── CONSULTAR ALUNO ───────────────────────────────────────────
async function buscarAluno() {
  const matricula = document.getElementById('busca-matricula').value.trim();
  const el = document.getElementById('resultado-aluno');

  if (!matricula) return toast('Digite a matrícula.', 'error');

  el.innerHTML = `<div class="empty-state"><div class="empty-icon">⏳</div><p>Buscando...</p></div>`;

  try {
    const d = await req('GET', `/alunos/matricula/${matricula}`);

    // Tabela de matérias com TODAS as notas + média + situação
    let tabelaMaterias = '';
    if (!d.materias || d.materias.length === 0) {
      tabelaMaterias = `
        <div class="empty-state" style="padding:2rem;">
          <div class="empty-icon">📚</div>
          <p>Nenhuma matrícula em matérias encontrada.</p>
        </div>`;
    } else {
      const linhas = d.materias.map(m => `
        <tr>
          <td>${m.materia}</td>
          <td class="mono">${m.codigoMateria || '—'}</td>
          <td class="mono">${fmt(m.nota1)}</td>
          <td class="mono">${fmt(m.nota2)}</td>
          <td class="mono">${fmt(m.nota3)}</td>
          <td class="mono"><strong>${fmt(m.media)}</strong></td>
          <td>${badgeStatus(m.aprovado)}</td>
        </tr>`).join('');

      tabelaMaterias = `
        <p class="section-title">Matérias matriculadas</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Matéria</th>
                <th>Código</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Nota 3</th>
                <th>Média</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>${linhas}</tbody>
          </table>
        </div>`;
    }

    const dataFmt = d.dataIngresso
      ? new Date(d.dataIngresso + 'T00:00:00').toLocaleDateString('pt-BR')
      : '—';

    el.innerHTML = `
      <div class="result-card">
        <div class="result-header">
          <div class="avatar">${iniciais(d.nome)}</div>
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
              <div class="info-label">Matrícula</div>
              <div class="info-value mono">${d.matricula}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Data de ingresso</div>
              <div class="info-value">${dataFmt}</div>
            </div>
          </div>
          ${tabelaMaterias}
        </div>
      </div>`;
  } catch {
    el.innerHTML = `
      <div class="result-card">
        <div class="empty-state" style="padding:2.5rem;">
          <div class="empty-icon">🔍</div>
          <p>Aluno não encontrado para a matrícula informada.</p>
        </div>
      </div>`;
  }
}

// ══════════════════════════════════════════════════════════════
// MÓDULO — MATÉRIA
// ══════════════════════════════════════════════════════════════

async function cadastrarMateria() {
  const codigo = document.getElementById('materia-codigo').value.trim();
  const nome   = document.getElementById('materia-nome').value.trim();
  const ementa = document.getElementById('materia-ementa').value.trim();

  if (!codigo || !nome) {
    return toast('Preencha o código e o nome da matéria.', 'error');
  }

  try {
    const data = await req('POST', '/materias', { codigo, nome, ementa });
    toast(`Matéria cadastrada! ID interno: ${data.id}`);
    limpar('materia-codigo', 'materia-nome', 'materia-ementa');
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ── CONSULTAR MATÉRIA ─────────────────────────────────────────
async function buscarMateria() {
  const codigo = document.getElementById('busca-materia').value.trim();
  const el = document.getElementById('resultado-materia');

  if (!codigo) return toast('Digite o código da matéria.', 'error');

  el.innerHTML = `<div class="empty-state"><div class="empty-icon">⏳</div><p>Buscando...</p></div>`;

  try {
    const d = await req('GET', `/materias/codigo/${codigo}`);

    el.innerHTML = `
      <div class="result-card">
        <div class="result-header">
          <div class="avatar">📖</div>
          <div>
            <h3>${d.nome}</h3>
            <p>Código: <span class="mono">${d.codigo}</span></p>
          </div>
        </div>
        <div class="result-body">
          <p class="section-title">Ementa</p>
          <div class="ementa-block">${d.ementa || 'Ementa não cadastrada.'}</div>
        </div>
      </div>`;
  } catch {
    el.innerHTML = `
      <div class="result-card">
        <div class="empty-state" style="padding:2.5rem;">
          <div class="empty-icon">🔍</div>
          <p>Matéria não encontrada para o código informado.</p>
        </div>
      </div>`;
  }
}

// ══════════════════════════════════════════════════════════════
// MÓDULO — TURMA
// ══════════════════════════════════════════════════════════════

async function cadastrarTurma() {
  const codigo = document.getElementById('turma-codigo').value.trim();

  if (!codigo) return toast('Informe o código da turma.', 'error');

  try {
    const data = await req('POST', '/turmas', { codigo });
    toast(`Turma criada com sucesso! ID interno: ${data.id}`);
    limpar('turma-codigo');
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ── CONSULTAR TURMA ───────────────────────────────────────────
async function buscarTurma() {
  const codigo = document.getElementById('busca-turma').value.trim();
  const el = document.getElementById('resultado-turma');

  if (!codigo) return toast('Digite o código da turma.', 'error');

  el.innerHTML = `<div class="empty-state"><div class="empty-icon">⏳</div><p>Buscando...</p></div>`;

  try {
    const d = await req('GET', `/turmas/codigo/${codigo}`);

    let corpoTabela = '';
    if (!d.alunos || d.alunos.length === 0) {
      corpoTabela = `
        <div class="empty-state" style="padding:2rem;">
          <div class="empty-icon">👥</div>
          <p>Nenhum aluno matriculado nesta turma.</p>
        </div>`;
    } else {
      // Contadores para o resumo
      let aprovados = 0;
      const linhas = d.alunos.map(a => {
        if (a.aprovado) aprovados++;
        return `
          <tr>
            <td>${a.aluno}</td>
            <td class="mono">${a.matricula || '—'}</td>
            <td>${a.materia || '—'}</td>
            <td class="mono">${fmt(a.nota1)}</td>
            <td class="mono">${fmt(a.nota2)}</td>
            <td class="mono">${fmt(a.nota3)}</td>
            <td class="mono"><strong>${fmt(a.media)}</strong></td>
            <td>${badgeStatus(a.aprovado)}</td>
          </tr>`;
      }).join('');

      const reprovados = d.alunos.length - aprovados;

      corpoTabela = `
        <div style="display:flex;gap:.75rem;margin-bottom:1.1rem;flex-wrap:wrap;">
          <span class="badge badge-info">👥 ${d.alunos.length} aluno${d.alunos.length !== 1 ? 's' : ''}</span>
          <span class="badge badge-success">✔ ${aprovados} aprovado${aprovados !== 1 ? 's' : ''}</span>
          ${reprovados > 0 ? `<span class="badge badge-danger">✖ ${reprovados} reprovado${reprovados !== 1 ? 's' : ''}</span>` : ''}
        </div>
        <p class="section-title">Alunos e desempenho</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Matrícula</th>
                <th>Matéria</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Nota 3</th>
                <th>Média</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>${linhas}</tbody>
          </table>
        </div>`;
    }

    el.innerHTML = `
      <div class="result-card">
        <div class="result-header">
          <div class="avatar">🏛</div>
          <div>
            <h3>Turma ${d.codigoTurma ?? d.codigo ?? '—'}</h3>
            <p>${d.alunos ? d.alunos.length : 0} aluno(s) matriculado(s)</p>
          </div>
        </div>
        <div class="result-body">
          ${corpoTabela}
        </div>
      </div>`;
  } catch {
    el.innerHTML = `
      <div class="result-card">
        <div class="empty-state" style="padding:2.5rem;">
          <div class="empty-icon">🔍</div>
          <p>Turma não encontrada para o código informado.</p>
        </div>
      </div>`;
  }
}

// ══════════════════════════════════════════════════════════════
// MÓDULO — MATRÍCULA
// ══════════════════════════════════════════════════════════════

async function matricularAluno() {
  const alunoId   = document.getElementById('mat-aluno-id').value;
  const materiaId = document.getElementById('mat-materia-id').value;
  const turmaId   = document.getElementById('mat-turma-id').value;
  const nota1     = parseFloat(document.getElementById('mat-nota1').value);
  const nota2     = parseFloat(document.getElementById('mat-nota2').value);
  const nota3     = parseFloat(document.getElementById('mat-nota3').value);

  if (!alunoId || !materiaId || !turmaId) {
    return toast('Informe o ID do aluno, da matéria e da turma.', 'error');
  }

  if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
    return toast('Preencha as três notas.', 'error');
  }

  if ([nota1, nota2, nota3].some(n => n < 0 || n > 10)) {
    return toast('As notas devem estar entre 0 e 10.', 'error');
  }

  try {
    await req('POST', `/alunos/${alunoId}/matriculas`, {
      materia: { id: Number(materiaId) },
      turma:   { id: Number(turmaId) },
      nota1,
      nota2,
      nota3
    });
    toast('Matrícula realizada com sucesso!');
    limpar('mat-aluno-id', 'mat-materia-id', 'mat-turma-id', 'mat-nota1', 'mat-nota2', 'mat-nota3');
    document.getElementById('media-preview').classList.remove('visible');
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ── PREVIEW DA MÉDIA EM TEMPO REAL ────────────────────────────
['mat-nota1', 'mat-nota2', 'mat-nota3'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', atualizarMediaPreview);
});

function atualizarMediaPreview() {
  const n1 = parseFloat(document.getElementById('mat-nota1').value);
  const n2 = parseFloat(document.getElementById('mat-nota2').value);
  const n3 = parseFloat(document.getElementById('mat-nota3').value);
  const preview = document.getElementById('media-preview');
  const valorEl = document.getElementById('media-valor');
  const statusEl = document.getElementById('media-status');

  if (!isNaN(n1) && !isNaN(n2) && !isNaN(n3)) {
    const media = (n1 + n2 + n3) / 3;
    preview.classList.add('visible');
    valorEl.textContent = media.toFixed(2);
    statusEl.innerHTML = media >= 6
      ? `<span class="badge badge-success">✔ Aprovado</span>`
      : `<span class="badge badge-danger">✖ Reprovado</span>`;
  } else {
    preview.classList.remove('visible');
  }
}