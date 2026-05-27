package com.universidade.sistema_universidade.controller;

import com.universidade.sistema_universidade.model.Aluno;
import com.universidade.sistema_universidade.model.Matricula;
import com.universidade.sistema_universidade.repository.AlunoRepository;
import com.universidade.sistema_universidade.repository.MatriculaRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/alunos")
public class AlunoController {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private MatriculaRepository matriculaRepository;

    @PostMapping
    public Aluno cadastrarAluno(@RequestBody Aluno aluno) {

        return alunoRepository.save(aluno);
    }

    @GetMapping("/matricula/{matricula}")
    public Map<String, Object> buscarPorMatricula(
        @PathVariable String matricula) {

        Aluno aluno = alunoRepository.findByMatricula(matricula)
                .orElse(null);

        if (aluno == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado");
        }

        List<Matricula> matriculas =
                matriculaRepository.findByAluno(aluno);

        List<Map<String, Object>> materias = new ArrayList<>();

        for (Matricula m : matriculas) {
            Map<String, Object> materiaInfo = new HashMap<>();
            materiaInfo.put("materia", m.getMateria().getNome());
            materiaInfo.put("media", m.getMedia());
            materias.add(materiaInfo);
        }

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("nome", aluno.getNome());
        resposta.put("matricula", aluno.getMatricula());
        resposta.put("endereco", aluno.getEndereco());
        resposta.put("dataIngresso", aluno.getDataIngresso());
        resposta.put("materias", materias);

        return resposta;
    }

    @PostMapping("/{id}/matriculas")
    public Matricula cadastrarMatricula(
            @PathVariable Long id,
            @RequestBody Matricula matricula) {

        Aluno aluno = alunoRepository.findById(id)
                .orElse(null);

        if (aluno == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado");
        }

        matricula.setAluno(aluno);

        return matriculaRepository.save(matricula);
    }
}