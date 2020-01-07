import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class TurnIntoFile {
    public void writeFile(String input)
    {
        try {
            File file = new File("inputFile.java");
            FileWriter fileWriter = new FileWriter(file);
            fileWriter.write(input);
            fileWriter.flush();
            fileWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
