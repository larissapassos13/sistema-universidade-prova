package com.universidade.sistema_universidade.repository;

import com.universidade.sistema_universidade.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TurmaRepository extends JpaRepository<Turma, Long> {

    Optional<Turma> findByCodigo(String codigo);
}