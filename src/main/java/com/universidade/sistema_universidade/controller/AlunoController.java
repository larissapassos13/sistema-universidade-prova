package com.universidade.sistema_universidade.controller;

import com.universidade.sistema_universidade.dao.AlunoDAO;
import com.universidade.sistema_universidade.model.Aluno;
import com.universidade.sistema_universidade.model.Matricula;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/alunos")
public class AlunoController {

    @Autowired
    private AlunoDAO alunoDAO;

    // =========================
    // CADASTRAR ALUNO
    // =========================
    @PostMapping
    public Aluno cadastrarAluno(@RequestBody Aluno aluno) {
        return alunoDAO.salvar(aluno);
    }

    @GetMapping
    public List<Aluno> listarAlunos() {
    return alunoDAO.listarTodos();
    }

    // =========================
    // CONSULTAR POR MATRÍCULA
    // =========================
    @GetMapping("/matricula/{matricula}")
    public Map<String, Object> buscarPorMatricula(@PathVariable String matricula) {

        Aluno aluno = alunoDAO.buscarPorMatricula(matricula)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        List<Matricula> matriculas = alunoDAO.buscarMatriculas(aluno);

        List<Map<String, Object>> materias = new ArrayList<>();

        for (Matricula m : matriculas) {
            Map<String, Object> info = new HashMap<>();

            info.put("materia", m.getMateria().getNome());
            info.put("codigoMateria", m.getMateria().getCodigo());
            info.put("nota1", m.getNota1());
            info.put("nota2", m.getNota2());
            info.put("nota3", m.getNota3());
            info.put("media", m.getMedia());
            info.put("aprovado", m.isAprovado());

            materias.add(info);
        }

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("nome", aluno.getNome());
        resposta.put("matricula", aluno.getMatricula());
        resposta.put("endereco", aluno.getEndereco());
        resposta.put("dataIngresso", aluno.getDataIngresso());
        resposta.put("materias", materias);

        return resposta;
    }

    // =========================
    // MATRICULAR ALUNO EM MATÉRIA
    // =========================
    @PostMapping("/{id}/matriculas")
    public Matricula cadastrarMatricula(
            @PathVariable Long id,
            @RequestBody Matricula matricula) {

        Aluno aluno = alunoDAO.buscarPorId(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        matricula.setAluno(aluno);

        return alunoDAO.salvarMatricula(matricula);
    }
    
}