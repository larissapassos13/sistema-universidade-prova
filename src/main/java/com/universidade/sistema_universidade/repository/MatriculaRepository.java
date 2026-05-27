package com.universidade.sistema_universidade.repository;

import com.universidade.sistema_universidade.model.Aluno;
import com.universidade.sistema_universidade.model.Matricula;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {

    List<Matricula> findByAluno(Aluno aluno); // vai buscar tds as materias do aluno

}