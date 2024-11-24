
using System.Data;

namespace prid_2324_g06.Models;


public class Query
{
    public List<string> Errors { get; set; } = new List<string>();
    public string[][] QueryAnswer { get; set; } = Array.Empty<string[]>();




    public string[][] QuerySolution { get; set; } = Array.Empty<string[]>();
    private readonly DataTable _tableAnswer = null!;
    private readonly DataTable _tableSolution = null!;



    public Query() {
        Errors.Add("requete vide");
    }



    public Query(DataTable tableAnswer, DataTable tableSolution) {
        _tableAnswer = tableAnswer;
        _tableSolution = tableSolution;
    }



    public void Evaluate() {
        SetErrors(_tableAnswer, _tableSolution);

        QueryAnswer = SetTable(_tableAnswer);

        if (Errors.Count == 0) {
            QuerySolution = SetTable(_tableSolution);
            CompareTables();
        }
    }


    private void SetErrors(DataTable table, DataTable table2) {//enlever les parametres
        if (table.Rows.Count != table2.Rows.Count)
            Errors.Add("bad number of rows");

        if (table.Columns.Count != table2.Columns.Count)
            Errors.Add("bad number of columns");
    }



    private string[][] SetTable(DataTable table) {
        // Récupère les noms des colonnes dans un tableau de strings
        int RowCount = table.Rows.Count; 
        int ColumnCount = table.Columns.Count;

        string[] Columns = new string[ColumnCount];
        for (int i = 0; i < ColumnCount; ++i)
            Columns[i] = table.Columns[i].ColumnName;

        // Récupère les données dans un tableau de strings à deux dimensions
        var data = new string[RowCount][];

        for (int j = 0; j < RowCount; j++) {

            data[j] = new string[ColumnCount];
            for (int i = 0; i < ColumnCount; ++i) {
                object value = table.Rows[j][i];
                string str;
                if (value == null)
                    str = "NULL";
                else {
                    if (value is DateTime d) {
                        if (d.TimeOfDay == TimeSpan.Zero)
                            str = d.ToString("yyyy-MM-dd");
                        else
                            str = d.ToString("yyyy-MM-dd hh:mm:ss");
                    } else
                        str = value?.ToString() ?? "";
                }
                data[j][i] = str;
            }
        }
        // Ajoute les noms des colonnes au début de la liste et retourne la liste.
        return data.Prepend(Columns).ToArray();

    }



    private void CompareTables() {
        List<string> sortedAnswer = new();
        List<string> sortedSolution = new();

        for (int i = 1; i < QueryAnswer.Length; ++i) {
            sortedAnswer.AddRange(QueryAnswer[i]);
            sortedSolution.AddRange(QuerySolution[i]);
        }

        sortedAnswer.Sort();
        sortedSolution.Sort();

        if (!sortedAnswer.SequenceEqual(sortedSolution))
            Errors.Add("wrong data");

    }


}

