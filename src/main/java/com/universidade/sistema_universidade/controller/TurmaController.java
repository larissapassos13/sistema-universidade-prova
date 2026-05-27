package com.universidade.sistema_universidade.controller;

import com.universidade.sistema_universidade.dao.TurmaDAO;
import com.universidade.sistema_universidade.model.Matricula;
import com.universidade.sistema_universidade.model.Turma;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/turmas")
public class TurmaController {

    @Autowired
    private TurmaDAO turmaDAO;

    // =========================
    // CADASTRAR TURMA
    // =========================
    @PostMapping
    public Turma cadastrarTurma(@RequestBody Turma turma) {
        return turmaDAO.salvar(turma);
    }

    // =========================
    // CONSULTAR TURMA
    // =========================
    @GetMapping("/codigo/{codigo}")
    public Map<String, Object> buscarTurma(@PathVariable String codigo) {

        Turma turma = turmaDAO.buscarPorCodigo(codigo)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada"));

        List<Map<String, Object>> alunos = new ArrayList<>();

        for (Matricula m : turma.getMatriculas()) {

            Map<String, Object> info = new HashMap<>();

            info.put("aluno", m.getAluno().getNome());
            info.put("matricula", m.getAluno().getMatricula());

            info.put("materia", m.getMateria().getNome());

            info.put("nota1", m.getNota1());
            info.put("nota2", m.getNota2());
            info.put("nota3", m.getNota3());

            info.put("media", m.getMedia());
            info.put("aprovado", m.isAprovado());

            alunos.add(info);
        }

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("codigoTurma", turma.getCodigo());
        resposta.put("alunos", alunos);

        return resposta;
    }
}