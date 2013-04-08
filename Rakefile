# check gem loaded
['rainbow'].each{ |gem_name|
  begin
    require gem_name
  rescue LoadError
    puts "Ruby Gem: #{gem_name} is required"
    exit
  end
}

library           = "pklib.js"
library_min       = "pklib.min.js"
dir_src           = "src/"
dir_doc           = "docs/"
dir_jsdoc         = "tools/jsdoc-toolkit/"

yuicompressor = "java -jar tools/yuicompressor/build/yuicompressor-2.4.7.jar #{library} -o #{library_min}"
jsdoc = "java -jar #{dir_jsdoc}jsrun.jar #{dir_jsdoc}app/run.js -d=#{dir_doc} -a -t=#{dir_jsdoc}templates/jsdoc -p #{dir_src} -q"

verbose(false)

# glowny plik biblioteki
if File.exists?(library)
  File.delete(library)
end
File.new(library, File::CREAT|File::TRUNC|File::RDWR, 0777)

# plik zminifajowany biblioteki
if File.exists?(library_min)
  File.delete(library_min)
end
File.new(library_min, File::CREAT|File::TRUNC|File::RDWR, 0777)

if File.directory?(dir_doc)
  FileUtils.rm_r dir_doc, :force => true
end
Dir.mkdir(dir_doc)

task :default

puts "------------- pklib JavaScript library -------------".foreground(:yellow)

print "[+] Generate library:".foreground(:cyan)

files = ["header.js", "ajax.js", "array.js", "aspect.js", "browser.js", "common.js", "cookie.js", \
 "css.js", "date.js", "dom.js", "event.js", "file.js", "object.js", "profiler.js", "string.js", \
 "ui.js", "ui.glass.js", "ui.loader.js", "ui.message.js", "ui.size.js", "url.js", "utils.js"]

lib_data = File.read(library)

File.open(library, 'w') do |f|
  for file in files
    f.write File.read("#{dir_src}#{file}")
    f.write lib_data
  end
end

puts "\t\t\t\tDone.".foreground(:green)

print "[+] Minifing:".foreground(:cyan)

sh yuicompressor

lib_data = File.read(library_min)

File.open(library_min, 'w') do |f|
  f.write "/** pklib JavaScript library | http://pklib.com/licencja.html **/\n"
  f.write lib_data
end

puts "\t\t\t\t\tDone.".foreground(:green)

print "[+] Generate documentation:".foreground(:cyan)
sh jsdoc
puts "\t\t\tDone.".foreground(:green)

