package com.universidade.sistema_universidade.dao;

import com.universidade.sistema_universidade.model.Aluno;
import com.universidade.sistema_universidade.model.Matricula;
import com.universidade.sistema_universidade.repository.AlunoRepository;
import com.universidade.sistema_universidade.repository.MatriculaRepository;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class AlunoDAO {

    private final AlunoRepository alunoRepository;
    private final MatriculaRepository matriculaRepository;

    public AlunoDAO(AlunoRepository alunoRepository,
                    MatriculaRepository matriculaRepository) {
        this.alunoRepository = alunoRepository;
        this.matriculaRepository = matriculaRepository;
    }

    public Aluno salvar(Aluno aluno) {
        return alunoRepository.save(aluno);
    }

    public Optional<Aluno> buscarPorMatricula(String matricula) {
        return alunoRepository.findByMatricula(matricula);
    }

    public Optional<Aluno> buscarPorId(Long id) {
        return alunoRepository.findById(id);
    }

    public List<Matricula> buscarMatriculas(Aluno aluno) {
        return matriculaRepository.findByAluno(aluno);
    }

    public Matricula salvarMatricula(Matricula matricula) {
        return matriculaRepository.save(matricula);
    }

    // ✔️ CORRETO AGORA
    public List<Aluno> listarTodos() {
        return alunoRepository.findAll();
    }
}