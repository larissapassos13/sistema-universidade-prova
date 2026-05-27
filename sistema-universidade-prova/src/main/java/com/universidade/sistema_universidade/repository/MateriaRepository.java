package com.universidade.sistema_universidade.repository;

import com.universidade.sistema_universidade.model.Materia;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MateriaRepository extends JpaRepository<Materia, Long> {

    Optional<Materia> findByCodigo(String codigo);

}