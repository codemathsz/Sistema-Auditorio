package br.com.senaisp.sistemaauditorio.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.senaisp.sistemaauditorio.model.Agendamento;

@Repository
public interface AgendamentoRepository extends PagingAndSortingRepository<Agendamento, Long> {

	@Query("SELECT a FROM Agendamento a where a.dataInicio >= :dataInicio  AND a.dataFinalizada <= :dataFinal")
	public boolean validacaoDataEHora(@Param("dataInicio") String dataInicio , @Param("dataFinal") String dataFinal); 
}