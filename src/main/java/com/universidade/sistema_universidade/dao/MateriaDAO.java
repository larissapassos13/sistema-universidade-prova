package com.universidade.sistema_universidade.dao;

import com.universidade.sistema_universidade.model.Materia;
import com.universidade.sistema_universidade.repository.MateriaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class MateriaDAO {

    private final MateriaRepository materiaRepository;

    public MateriaDAO(MateriaRepository materiaRepository) {
        this.materiaRepository = materiaRepository;
    }

    public Materia salvar(Materia materia) {
        return materiaRepository.save(materia);
    }

    public Optional<Materia> buscarPorCodigo(String codigo) {
        return materiaRepository.findByCodigo(codigo);
    }
}