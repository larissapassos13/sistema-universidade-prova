package com.universidade.sistema_universidade.controller;

import com.universidade.sistema_universidade.model.Materia;
import com.universidade.sistema_universidade.repository.MateriaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/materias")
public class MateriaController {

    @Autowired
    private MateriaRepository materiaRepository;

    @PostMapping
    public Materia cadastrarMateria(@RequestBody Materia materia) {

        return materiaRepository.save(materia);
    }

    @GetMapping("/codigo/{codigo}")
    public Materia buscarPorCodigo(@PathVariable String codigo) {

        return materiaRepository.findByCodigo(codigo)
                .orElse(null);
    }
}