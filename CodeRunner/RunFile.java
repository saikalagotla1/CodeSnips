import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class RunFile {
    public static void main(String[] args){
        String strRun = "";
        int i = 1;
        while(i < args.length){
            strRun += (args[i] + " ");
            i++;
        }

        try {
            File file = new File("inputFile.java");
            FileWriter fileWriter = new FileWriter(file);
            fileWriter.write(strRun);
            fileWriter.flush();
            fileWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        String run = "java inputFile.java";
        try {
            Runtime.getRuntime().exec(run);
        }
        catch (Exception e) {
            System.out.println("HEY Buddy ! U r Doing Something Wrong ");
            e.printStackTrace();
        }
    }
}
