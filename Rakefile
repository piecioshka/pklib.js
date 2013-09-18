# check gem loaded
%w(rainbow uglifier yui/compressor).each{ |gem_name|
  begin
    require gem_name
  rescue LoadError
    puts "Ruby Gem: #{gem_name} is required"
    exit
  end
}

LIB_NAME = 'pklib.js'
LIB_NAME_MIN = 'pklib.min.js'
DIR_SRC = 'src/'
DIR_DOCS = 'api/'

verbose(false)

# master library file
if File.exists?(LIB_NAME)
  File.delete(LIB_NAME)
end
File.new(LIB_NAME, File::CREAT|File::TRUNC|File::RDWR, 0777)

# minified library file
if File.exists?(LIB_NAME_MIN)
  File.delete(LIB_NAME_MIN)
end
File.new(LIB_NAME_MIN, File::CREAT|File::TRUNC|File::RDWR, 0777)

# dir with documentation
if File.directory?(DIR_DOCS)
  FileUtils.rm_r DIR_DOCS, :force => true
end
Dir.mkdir(DIR_DOCS)

def its_ok
  puts "\t\t\t\t\t" + '['.foreground(:cyan) + ' ok '.foreground(:green) + ']'.foreground(:cyan)
end

def compress_js(file_content)
  # compress by Uglifier
  Uglifier.new(:output => {:comments => :none}).compile(file_content)
end

task :default => [:join, :doc, :min]

puts '-------------- pklib JavaScript library --------------'.foreground(:magenta)

task :join => [] do
  print '*'.foreground(:green) + ' Build ...'

  files = ["header.js", "ajax.js", "array.js", "aspect.js", "common.js", "cookie.js", \
   "css.js", "dom.js", "event.js", "file.js", "object.js", "profiler.js", "string.js", \
   "ui.js", "ui.glass.js", "ui.loader.js", "ui.message.js", "ui.size.js", "url.js", "utils.js"]

  lib_data = File.read(LIB_NAME)

  File.open(LIB_NAME, 'w') do |f|
    for file in files
      f.write File.read("#{DIR_SRC}#{file}")
      f.write lib_data
    end
  end

  its_ok()
end

task :doc => [] do
  print '*'.foreground(:green) + ' Documents ...'

  sh "jsdoc #{LIB_NAME} -d api"

  its_ok()
end

task :min => [] do
  print '*'.foreground(:green) + ' Minifing ...'

  # create new file
  file = File.new(LIB_NAME_MIN, 'w')
  file.write "/** pklib JavaScript library | http://pklib.com/licencja.html **/\n"
  # fill content from all files js to one
  file.write(compress_js(File.read(LIB_NAME)))
  file.close()

  its_ok()
end