// ── URL base da API ─────────────────────────────
const API = 'http://localhost:8080';

// ── NAVEGAÇÃO ───────────────────────────────────
function goTo(pageId, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));

  document.getElementById(pageId).classList.add('active');
  btn.classList.add('active');
}

// ── TOAST ───────────────────────────────────────
function toast(msg, tipo = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast-${tipo}`;
  t.textContent = msg;

  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── FETCH SEGURO (CORRIGIDO) ───────────────────
async function req(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null
  });

  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(
      (data && data.message) ||
      (typeof data === 'string' ? data : JSON.stringify(data)) ||
      'Erro na requisição'
    );
  }

  return data;
}

// ── ALUNO ───────────────────────────────────────
async function cadastrarAluno() {
  const nome = document.getElementById('aluno-nome').value.trim();
  const endereco = document.getElementById('aluno-endereco').value.trim();
  const matricula = document.getElementById('aluno-matricula').value.trim();
  const dataIngresso = document.getElementById('aluno-data').value;

  if (!nome || !matricula || !dataIngresso) {
    return toast('Preencha nome, matrícula e data', 'error');
  }

  try {
    const data = await req('POST', '/alunos', {
      nome,
      endereco,
      matricula,
      dataIngresso
    });

    toast(`Aluno criado! ID: ${data.id}`);

    ['aluno-nome','aluno-endereco','aluno-matricula','aluno-data']
      .forEach(id => document.getElementById(id).value = '');

  } catch (e) {
    toast(e.message, 'error');
  }
}

// ── BUSCAR ALUNO ───────────────────────────────
async function buscarAluno() {
  const matricula = document.getElementById('busca-matricula').value.trim();
  const el = document.getElementById('resultado-aluno');

  if (!matricula) return toast('Digite a matrícula', 'error');

  el.innerHTML = 'Buscando...';

  try {
    const d = await req('GET', `/alunos/matricula/${matricula}`);

    const materias = (d.materias || []).map(m => {
      const media = Number(m.media || 0).toFixed(2);
      const ok = Number(m.media || 0) >= 6;

      return `
        <tr>
          <td>${m.materia}</td>
          <td class="mono">${media}</td>
          <td>${ok ? '✔' : '✘'}</td>
        </tr>
      `;
    }).join('');

    el.innerHTML = `
      <div class="result-card">
        <h3>${d.nome}</h3>
        <p>${d.matricula}</p>

        <table>
          <thead>
            <tr><th>Matéria</th><th>Média</th><th>Status</th></tr>
          </thead>
          <tbody>${materias}</tbody>
        </table>
      </div>
    `;

  } catch {
    el.innerHTML = 'Aluno não encontrado';
  }
}

// ── MATÉRIA ─────────────────────────────────────
async function cadastrarMateria() {
  const codigo = document.getElementById('materia-codigo').value.trim();
  const nome = document.getElementById('materia-nome').value.trim();
  const ementa = document.getElementById('materia-ementa').value.trim();

  if (!codigo || !nome) {
    return toast('Preencha código e nome', 'error');
  }

  try {
    await req('POST', '/materias', {
      codigo,
      nome,
      ementa
    });

    toast('Matéria criada!');

    ['materia-codigo','materia-nome','materia-ementa']
      .forEach(id => document.getElementById(id).value = '');

  } catch (e) {
    toast(e.message, 'error');
  }
}

// ── TURMA ───────────────────────────────────────
async function cadastrarTurma() {
  const codigo = document.getElementById('turma-codigo').value.trim();

  if (!codigo) return toast('Informe código da turma', 'error');

  try {
    await req('POST', '/turmas', { codigo });

    toast('Turma criada!');
    document.getElementById('turma-codigo').value = '';

  } catch (e) {
    toast(e.message, 'error');
  }
}

// ── BUSCAR TURMA ───────────────────────────────
async function buscarTurma() {
  const codigo = document.getElementById('busca-turma').value.trim();
  const el = document.getElementById('resultado-turma');

  if (!codigo) return toast('Digite código', 'error');

  el.innerHTML = 'Buscando...';

  try {
    const d = await req('GET', `/turmas/codigo/${codigo}`);

    const alunos = (d.alunos || []).map(a => {
      const media = Number(a.media || 0).toFixed(2);
      const ok = Number(a.media || 0) >= 6;

      return `
        <tr>
          <td>${a.aluno}</td>
          <td>${media}</td>
          <td>${ok ? '✔' : '✘'}</td>
        </tr>
      `;
    }).join('');

    el.innerHTML = `
      <div class="result-card">
        <h3>Turma ${d.codigoTurma ?? d.codigo ?? '—'}</h3>
        <table>
          <tbody>${alunos}</tbody>
        </table>
      </div>
    `;

  } catch {
    el.innerHTML = 'Turma não encontrada';
  }
}

// ── MATRÍCULA ───────────────────────────────────
async function matricularAluno() {
  const alunoId = document.getElementById('mat-aluno-id').value;
  const materiaId = document.getElementById('mat-materia-id').value;

  const nota1 = Number(document.getElementById('mat-nota1').value);
  const nota2 = Number(document.getElementById('mat-nota2').value);
  const nota3 = Number(document.getElementById('mat-nota3').value);

  if (!alunoId || !materiaId || isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
    return toast('Preencha todos os campos corretamente', 'error');
  }

  try {
    await req('POST', `/alunos/${alunoId}/matriculas`, {
      materia: { id: Number(materiaId) },
      nota1,
      nota2,
      nota3
    });

    toast('Matrícula feita com sucesso!');

  } catch (e) {
    toast(e.message, 'error');
  }
}

// ── PREVIEW MÉDIA ───────────────────────────────
['mat-nota1','mat-nota2','mat-nota3'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener('input', () => {
    const n1 = Number(document.getElementById('mat-nota1').value);
    const n2 = Number(document.getElementById('mat-nota2').value);
    const n3 = Number(document.getElementById('mat-nota3').value);

    const preview = document.getElementById('media-preview');

    if (!isNaN(n1) && !isNaN(n2) && !isNaN(n3)) {
      const media = ((n1 + n2 + n3) / 3).toFixed(2);

      preview.style.display = 'block';
      document.getElementById('media-valor').textContent = media;
    } else {
      preview.style.display = 'none';
    }
  });
});